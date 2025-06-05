import numpy as np
import hygese as hgs
import math
import os
import subprocess
from api_v2 import Route, RoutingRequest, RoutingResponse, logger, Job, Geometry
from alns_solver import VRPState, alns_optimize
from typing import List, Dict, Tuple
from collections import defaultdict
from vrplib import read_instance, read_solution
from ors import get_distance_matrix, get_directions


def solve_with_pyvrp(instance_path, time_limit=3, seed=0, verbose=1):
  """Solve VRP instance using PyVRP."""
  from pyvrp import read, Model
  from pyvrp.stop import MaxIterations, MaxRuntime

  try:
    instance = read(instance_path, round_func="none")
  except Exception as e:
    raise RuntimeError(f"Reading instance failed: {str(e)}")
  model = Model.from_data(instance)
  result = model.solve(stop=MaxRuntime(time_limit), seed=seed, display=verbose)
  print(f"PyVRP result: {result}")


def solve_with_binary(instance_path, time_limit=3, seed=0, verbose=1):
  """Solve VRP instance using external HGS binary."""
  exec_path = os.path.join("bin", "hgs")
  assert os.path.isfile(exec_path), f"HGS executable '{exec_path}' not found"

  hgs_cmd = [
    exec_path,
    instance_path,
    "solution.sol",
    "-t", str(time_limit),
    "-seed", str(seed),
    "-log", str(verbose)
  ]
  print(f"HGS binary run with cmd: {hgs_cmd}")

  try:
    result = subprocess.run(hgs_cmd, capture_output=True, text=True, check=True)
    print(result.stdout)
  except subprocess.CalledProcessError as e:
    print(f"Solver failed with return code {e.returncode}")
    print(e.stderr)


def solve_with_hygese(instance_path, time_limit=3, seed=0, verbose=1):
  """Solve VRP instance using Hygese Python API."""
  try:
    instance = read_instance(instance_path)
    distance_matrix = instance["edge_weight"]
    demands = instance["demand"]
    depot = instance["depot"][0] # only support single-depot
    vehicle_capacity = instance["capacity"]
    n = len(demands)

    data = {
      "service_times": np.zeros(n), # default to 0
      "distance_matrix": distance_matrix,
      "vehicle_capacity": vehicle_capacity,
      "demands": demands,
      # "num_vehicles": 10**9, # uncapped vehicles limit
      "depot": depot
    }
    ap = hgs.AlgorithmParameters(timeLimit=time_limit, seed=seed)
    hgs_solver = hgs.Solver(parameters=ap, verbose=verbose)
    result = hgs_solver.solve_cvrp(data)
    print(f"Routes: {result.routes}\nCost: {result.cost}")

  except Exception as e:
    print(str(e))
    raise RuntimeError(f"Reading instance path failed: {str(e)}")


def solve_request(request: RoutingRequest):
  """Dispatch routing request to static or dynamic solver."""
  if not request.routes:
    return solve_static_mdvrp(request)
  else:
    return insert_jobs_best_cost(request)


def insert_jobs_best_cost(request: RoutingRequest):
  """Insert jobs into existing routes by minimizing cost increase."""
  # all_routes = {route.vehicle_id: list(route.steps) for route in request.routes}
  all_routes = {route.vehicle_id: route for route in request.routes}
  modified_vehicle_ids = set() # track which routes got updated
  new_dists = {} # map vehicle_id to new distance
  new_durations = {} # map vehicle_id to new duration
  new_geometries = {} # map vehicle_id to new geometry

  for job in request.jobs:
    best_insertion = None
    best_cost_increase = float("inf")

    for vehicle in request.vehicles:
      if vehicle.load + job.demand > vehicle.capacity:
        continue

      # route_steps = all_routes.get(vehicle.id, [])
      route_steps = all_routes[vehicle.id].steps if vehicle.id in all_routes else []
      old_dist = all_routes[vehicle.id].distance if vehicle.id in all_routes else 0.0

      current_points = [(vehicle.start.lat, vehicle.start.lon)] + [
        (step.location.lat, step.location.lon) for step in route_steps
      ] + [(vehicle.end.lat, vehicle.end.lon)]

      for i in range(1, len(current_points)):
        new_points = current_points[:i] + [(job.location.lat, job.location.lon)] + current_points[i:]
        # new_dist = _calculate_route_distance(new_points)
        # old_dist = _calculate_route_distance(current_points)
        new_geometry, new_dist, new_duration = get_directions(new_points, request.profile)
        cost_increase = new_dist - old_dist

        if cost_increase < best_cost_increase:
          best_cost_increase = cost_increase
          best_insertion = (vehicle.id, i, new_dist, new_duration, new_geometry)

    if not best_insertion:
      raise RuntimeError(f"No feasible insertion for job {job.id}")

    vehicle_id, insert_pos, route_dist, route_duration, route_geometry = best_insertion
    all_routes.setdefault(vehicle_id, Route(vehicle_id=vehicle_id, steps=[]))
    all_routes[vehicle_id].steps.insert(insert_pos, job)
    modified_vehicle_ids.add(vehicle_id)
    new_dists[vehicle_id] = route_dist
    new_durations[vehicle_id] = route_duration
    new_geometries[vehicle_id] = route_geometry

  # this one return full routes
  # response_routes = [
  #   Route(vehicle_id=vid, steps=steps) for vid, steps in all_routes.items()
  # ]

  # return only updated routes
  response_routes = [
    Route(vehicle_id=vid, steps=all_routes[vid].steps, distance=new_dists[vid], duration=new_durations[vid], geometry=new_geometries[vid])
    for vid in modified_vehicle_ids
  ]

  return RoutingResponse(routes=response_routes)
      

def _calculate_route_distance(points):
  """Compute total route distance using haversine formula."""
  if not points or len(points) < 2:
    return 0.0

  return sum(
    _calculate_haversine_distance(lat1, lon1, lat2, lon2)
    for (lat1, lon1), (lat2, lon2) in zip(points[:-1], points[1:])
  )


# Too slow, currently not in used
def assign_greedy_and_solve_tsp(request: RoutingRequest):
  """Assign jobs to closest vehicles and resolve with TSP."""
  all_routes = []

  for job in request.jobs:
    job_lat, job_lon = job.location.lat, job.location.lon
    closest_vehicle = None
    min_dist = float("inf")

    # find the closest vehicle with enough capacity
    for vehicle in request.vehicles:
      vehicle_lat, vehicle_lon = vehicle.start.lat, vehicle.start.lon
      dist = _calculate_haversine_distance(job_lat, job_lon, vehicle_lat, vehicle_lon)
      if dist < min_dist and vehicle.load + job.demand <= vehicle.capacity:
        min_dist = dist
        closest_vehicle = vehicle

    logger.info(f"Get closest vehicle: {closest_vehicle}")

    # find the round of the closest vehicle
    assigned_route = None
    for route in request.routes:
      if route.vehicle_id == closest_vehicle.id:
        assigned_route = route
        break

    logger.info(f"Get assigned route: {assigned_route}")

    # solve the route with static solver
    depot = (vehicle.start.lat, vehicle.start.lon) # this is the current position of the vehicle

    # if there's assigned route we simulate tsp 
    # else the vehicle is not yet assigned so we just dispatch it
    if assigned_route:
      customers_jobs = {}
      customers_jobs[(job.location.lat, job.location.lon)] = job
      for step in assigned_route.steps:
        lat, lon = step.location.lat, step.location.lon
        customers_jobs[(lat,lon)] = step

      customers = [(job_lat, job_lon)] + [(s.location.lat, s.location.lon) for s in assigned_route.steps]
      distance_matrix = _build_distance_matrix_from_coords(depot, customers)
      result = _solve_tsp_with_hygese(distance_matrix)

      logger.info(f"Result: {result.routes}")
      logger.info(customers_jobs)
      steps = []
      for r in result.routes[0]:
        customer = customers[r - 1]
        steps.append(customers_jobs[customer])
      
      logger.info(f"Steps: {steps}")
      route_response = Route(
        vehicle_id=closest_vehicle.id,
        steps=steps
      )
      logger.info(route_response)

      all_routes.append(route_response)

    elif not closest_vehicle:
      raise RuntimeError(f"No valid vehicle to assign the new job")

    else:
      route_response = Route(
        vehicle_id=closest_vehicle.id,
        steps=[job]
      )
      all_routes.append(route_response)
    
  return RoutingResponse(routes=all_routes)



def _solve_tsp_with_hygese(distance_matrix):
  """Solve TSP using Hygese given a distance matrix."""
  data = {
    "distance_matrix": distance_matrix
  }
  ap = hgs.AlgorithmParameters(timeLimit=1.0)
  hgs_solver = hgs.Solver(parameters=ap, verbose=True)
  try:
    result = hgs_solver.solve_tsp(data)

    if result is None or not hasattr(result, "cost") or not hasattr(result, "routes"):
      raise RuntimeError("Solver returned invalid or incomplete result.")

    logger.info(f"Hygese returned solution with cost {result.cost}.")
    return result

  except Exception as e:
    logger.error(f"Hygese solver failed: {str(e)}")
    raise RuntimeError("TSP solver failed to produce a valid result.") from e


def solve_static_mdvrp(request: RoutingRequest):
  """Solve static multi-depot CVRP request."""
  logger.info("Received request for VRP solving.")
  depots_vehicles, customers_jobs = _extract_depots_and_jobs(request)
  depot_coords = list(depots_vehicles.keys())
  customer_coords = list(customers_jobs.keys())
  depot_capacity = [sum([v.capacity for v in depots_vehicles[d]]) for d in depot_coords]
  customer_demand = [customers_jobs[c].demand for c in customer_coords]

  logger.info(f"Parsed {len(depot_coords)} depot(s) and {len(customer_coords)} customer(s).")
  # clusters = _cluster_customers_by_distance_with_capacity(depot_coords, customer_coords, depot_capacity, customer_demand)
  clusters = _cluster_customers_by_distance_with_capacity_with_profile(depot_coords, customer_coords, depot_capacity, customer_demand, request.profile)
  logger.info(f"Generated {len(clusters)} cluster(s) based on depots.")

  all_routes = []

  for depot, customers in clusters.items():
    logger.info(f"Processing depot {depot} with {len(customers)} assigned customer(s).")

    # if there's no customer then skip
    if not customers:
      logger.info(f"Depot {depot} has no assigned customers. Skipping...")
      continue

    # hygese is freezing when there's one customer
    if len(customers) == 1:
      logger.info(f"Depot {depot} is assigned to only one customer {customers[0]}.")
      customer = customers[0]
      route_response = Route(
        vehicle_id=depots_vehicles[depot][0].id,
        steps=[customers_jobs[customer]]
      )
      all_routes.append(route_response)
      continue

    # params for solver
    # distance_matrix = _build_distance_matrix_from_coords(depot, customers)
    points = [depot] + customers
    distance_matrix = get_distance_matrix(points=points, profile=request.profile)
    num_vehicles = len(depots_vehicles[depot])
    demands = [0] + [customers_jobs[c].demand for c in customers] # demand[depot] set to 0
    vehicle_capacity = sum([v.capacity for v in depots_vehicles[depot]]) / num_vehicles # taking average capacity

    logger.info(f"Depot {depot} — Vehicles: {num_vehicles}, Capacity per vehicle: {vehicle_capacity}")
    logger.info(f"Distance matrix size: {len(distance_matrix)}x{len(distance_matrix[0])}, Demands: {demands}")
    
    result = _solve_cvrp_with_hygese(distance_matrix, demands, vehicle_capacity, num_vehicles)
    logger.info(f"Solved cluster for depot {depot}. Cost: {result.cost}, Routes: {result.routes}")

    # parse to route response
    # we assume vehicles are all the same (mostly yes)
    # so we simply assign vehicle in order
    # also note that we might not use all of the vehicles
    vehicles = depots_vehicles[depot]
    for i, route in enumerate(result.routes):
      # point = (vehicles[i].start.lat, vehicles[i].start.lon)
      # distance = 0.0
      steps = []
      for r in route:
        customer = customers[r - 1]
        # next_point = (customers_jobs[customer].location.lat, customers_jobs[customer].location.lon)
        # distance += _calculate_haversine_distance(point[0], point[1], next_point[0], next_point[1])
        # point = next_point
        steps.append(customers_jobs[customer])
        
      vehicle = vehicles[i]
      points = [(vehicle.start.lat, vehicle.start.lon)] + [(job.location.lat, job.location.lon) for job in steps] + [(vehicle.end.lat, vehicle.end.lon)]
      geometry, distance, duration = get_directions(points, request.profile)

      route_response = Route(
        vehicle_id=vehicle.id,
        steps=steps,
        distance=distance,
        duration=duration,
        geometry=geometry
        )

      all_routes.append(route_response)
      
  return RoutingResponse(routes=all_routes)


def _calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float):
  """Compute haversine distance between two coordinates."""
  R = 6371
  phi1 = math.radians(lat1)
  phi2 = math.radians(lat2)
  delta_phi = math.radians(lat2 - lat1)
  delta_lambda = math.radians(lon2 - lon1)
  a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
  c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
  return R * c


def _build_distance_matrix_from_coords(depot: List[float], customers: List[List[float]]):
  """Build distance matrix for a depot and its customers."""
  points = [depot] + customers
  n = len(points)
  distance_matrix = [[0.0] * n for _ in range(n)]

  for i in range(n):
    for j in range(i + 1, n):
      lat1, lon1 = points[i]
      lat2, lon2 = points[j]
      dist = _calculate_haversine_distance(lat1, lon1, lat2, lon2)
      distance_matrix[i][j] = dist
      distance_matrix[j][i] = dist

  return distance_matrix


def _extract_depots_and_jobs(request: RoutingRequest):
  """Extract depot-vehicle and customer-job mappings from request."""
  depots_vehicles = defaultdict(list)
  customers_jobs = dict()

  for v in request.vehicles:
    lat, lon = v.start.lat, v.start.lon
    depots_vehicles[(lat, lon)].append(v)

  for j in request.jobs:
    lat, lon = j.location.lat, j.location.lon
    customers_jobs[(lat, lon)] = j

  logger.info(f"Extracted {len(depots_vehicles)} depots and {len(customers_jobs)} jobs from request.")
  return depots_vehicles, customers_jobs



def _cluster_customers_by_distance_with_capacity_with_profile(
  depot_coords: List[List[float]],
  customer_coords: List[List[float]],
  depot_capacity: List[List[float]],
  customer_demand: List[List[float]],
  profile: str
):
  """Cluster customers to closest depots considering capacity and using routing profile-based distance matrix."""
  clusters = defaultdict(list)
  points = depot_coords + customer_coords
  distance_matrix = get_distance_matrix(points=points, profile=profile)

  num_depots = len(depot_coords)

  for i, coord in enumerate(customer_coords):
    customer_index = num_depots + i
    min_distance = float('inf')
    closest_depot = None
    closest_depot_index = -1

    for j in range(num_depots):
      if depot_capacity[j] <= customer_demand[i]:
        continue
      distance = distance_matrix[customer_index][j]
      if distance < min_distance:
        min_distance = distance
        closest_depot = depot_coords[j]
        closest_depot_index = j

      if closest_depot:
        clusters[closest_depot].append(coord)
        depot_capacity[closest_depot_index] -= customer_demand[i]

  logger.info(f"Clustering result: {dict((k, len(v)) for k, v in clusters.items())}")
  return clusters

def _cluster_customers_by_distance_with_capacity(depot_coords: List[List[float]], customer_coords: List[List[float]], depot_capacity: List[List[float]], customer_demand: List[List[float]]):
  """Cluster customers to closest depots considering capacity."""
  clusters = defaultdict(list)

  for i, coord in enumerate(customer_coords):
    customer_lat, customer_lon = coord
    min_distance = float('inf')
    closest_depot = None
    closest_depot_index = -1

    for j, depot in enumerate(depot_coords):
      if depot_capacity[j] <= customer_demand[i]:
        continue
      depot_lat, depot_lon = depot
      distance = _calculate_haversine_distance(customer_lat, customer_lon, depot_lat, depot_lon)
      if distance < min_distance:
        min_distance = distance
        closest_depot = depot
        closest_depot_index = j

    if closest_depot:
      clusters[closest_depot].append(coord)
      depot_capacity[closest_depot_index] -= customer_demand[i]

  logger.info(f"Clustering result: {dict((k, len(v)) for k, v in clusters.items())}")
  return clusters


def _cluster_customers_by_distance(depot_coords: List[List[float]], customer_coords: List[List[float]]):
  """Cluster customers to closest depots without capacity check."""
  clusters = defaultdict(list)

  for coord in customer_coords:
    customer_lat, customer_lon = coord
    min_distance = float('inf')
    closest_depot = None

    for depot in depot_coords:
      depot_lat, depot_lon = depot
      distance = _calculate_haversine_distance(customer_lat, customer_lon, depot_lat, depot_lon)
      if distance < min_distance:
        min_distance = distance
        closest_depot = depot

    clusters[closest_depot].append(coord)

  logger.info(f"Clustering result: {dict((k, len(v)) for k, v in clusters.items())}")
  return clusters


def _solve_cvrp_with_hygese(distance_matrix: List[List[float]], demands: List[float], vehicle_capacity: float, num_vehicles: int):
  """Solve CVRP using Hygese given distances, demands, and capacity."""
  n = len(demands)
  logger.info(f"Solving CVRP with {n} nodes, {num_vehicles} vehicles, capacity {vehicle_capacity}.")

  ap = hgs.AlgorithmParameters(timeLimit=1.0)
  hgs_solver = hgs.Solver(parameters=ap, verbose=False)

  data = {
    "service_times": np.zeros(n),
    "distance_matrix": distance_matrix,
    "vehicle_capacity": vehicle_capacity,
    "demands": demands,
    "num_vehicles": num_vehicles,
    "depot": 0
  }

  try:
    result = hgs_solver.solve_cvrp(data)

    if result is None or not hasattr(result, "cost") or not hasattr(result, "routes"):
      raise RuntimeError("Solver returned invalid or incomplete result.")

    logger.info(f"Hygese returned solution with cost {result.cost}.")
    return result

  except Exception as e:
    logger.error(f"Hygese solver failed: {str(e)}")
    raise RuntimeError("CVRP solver failed to produce a valid result.") from e


# updated impl
from gancp.read_mdvrp import MDVRPInstance
from gancp.genetic import solve_instance
from collections import defaultdict, Counter
from ors import get_directions

def solve(request: RoutingRequest):
  if not request.routes:
    return _solve_static_mdvrp(request)
  else:
    return _solve_dynamic_mdvrp(request)


# static solver
def _solve_static_mdvrp(request:RoutingRequest):
  instance = _parse_static_request(request)
  job_id_to_job = {job.id:job for job in request.jobs}
  depot_id_to_depot_idx = {d.id:i for i, d in enumerate(request.depots)}
  depot_idx_to_vehicles = defaultdict(list)
  for v in request.vehicles:
    depot_idx = depot_id_to_depot_idx[v.depot_id]
    depot_idx_to_vehicles[depot_idx].append(v)

  cost, routes = solve_instance(instance, "harversine")
  # print(routes)

  all_routes = []
  for depot_idx, depot_routes in enumerate(routes):
    if depot_routes: # depot_routes = None - no assigned requests
      depot = request.depots[depot_idx]
      vehicle_idx = 0
      for route in depot_routes:
        vehicle = depot_idx_to_vehicles[depot_idx][vehicle_idx]
        steps = [request.jobs[j_idx] for j_idx in route]

        # update unassigned jobs
        for job in steps:
          del job_id_to_job[job.id]

        # use ors api
        points = [depot.location] + [s.location for s in steps] + [depot.location]
        geometry, distance, duration = get_directions(points, vehicle.profile)

        route_response = Route(vehicle_id=vehicle.id, steps=steps, distance=distance, duration=duration, geometry=geometry)
        all_routes.append(route_response)
        vehicle_idx += 1
  
  unassigned = job_id_to_job.values()
  return RoutingResponse(routes=all_routes, unassigned=unassigned)


# dynamic solver
def _solve_dynamic_mdvrp(request: RoutingRequest):
  vehicle_id_to_route = {route.vehicle_id:route for route in request.routes}
  depot_id_to_depot = {depot.id:depot for depot in request.depots}
  vehicle_id_to_depot = {vehicle.id:depot_id_to_depot[vehicle.depot_id] for vehicle in request.vehicles}
  vehicle_id_to_vehicle = {vehicle.id:vehicle for vehicle in request.vehicles}
  all_routes = request.routes
  job_id_to_job = {job.id:job for job in request.jobs} # hold unassigned jobs

  # compute current load of each route
  vehicle_id_to_load = defaultdict(float)
  for route in vehicle_id_to_route.values():
    vehicle_id = route.vehicle_id 
    load = sum(s.demand for s in route.steps)
    vehicle_id_to_load[vehicle_id] = load

  for job in request.jobs:
    # best insertion with capacity constraint in current active routes
    best_diff, best_route, best_pos, best_route_idx = float("inf"), None, None, -1
    for i, route in enumerate(all_routes):
      load = vehicle_id_to_load[route.vehicle_id]
      vehicle = vehicle_id_to_vehicle[vehicle_id]
      if load + job.demand > vehicle.capacity:
        continue

      depot = vehicle_id_to_depot[route.vehicle_id]
      # old_dist = route.distance
      # old_points = [depot.location] + [j.location for j in route.steps] + [depot.location]

      # best pos
      remaining_steps, continue_index = find_remaining_route(route)
      remaining_points = [vehicle.location] + [s.location for s in remaining_steps] + [depot.location]
      remaining_dist = _calculate_route_distance(remaining_points)

      # for pos in range(len(route.steps) + 1):
      #   new_points = old_points[:pos] + [job.location] + old_points[pos:]
      #   new_dist = _calculate_route_distance(new_points)
      #   diff = new_dist - old_dist
      #   if diff < best_diff:
      #     best_diff = diff
      #     best_route = route
      #     best_pos = pos

      for pos in range(len(remaining_steps) + 1):
        new_remaining_steps = remaining_steps[:pos] + [job] + remaining_steps[pos:]
        new_remaining_points = [vehicle.location] + [s.location for s in new_remaining_steps] + [depot.location]
        new_remaining_dist = _calculate_route_distance(new_remaining_points)
        diff = new_remaining_dist - remaining_dist
        if diff < best_diff:
          best_diff = diff
          best_route = route
          best_pos = pos + continue_index
          best_route_idx = i
    
    if best_route is not None and best_pos is not None:
      best_route.steps.insert(best_pos, job)
      vehicle_id_to_route[best_route.vehicle_id] = best_route
      all_routes[best_route_idx] = best_route
      del job_id_to_job[job.id]

    else:
      # create new route if no insertion found
      assigned_vehicle_ids = set(vehicle_id_to_route.keys())
      unassigned_vehicles = [v for v in request.vehicles if v.id not in assigned_vehicle_ids and v.capacity >= job.demand]
      if not unassigned_vehicles:
        continue

      vehicle = unassigned_vehicles[0]
      depot = depot_id_to_depot[vehicle.depot_id]
      steps = [job]
      # points = [depot.location] + [job.location] + [depot.location]
      new_route = Route(
        vehicle_id=vehicle.id,
        steps=steps,
        distance=0.0,
        duration=0.0,
        geometry=None
      )
      vehicle_id_to_route[vehicle.id] = new_route
      all_routes.append(new_route)
      del job_id_to_job[job.id]
  
  unassigned = list(job_id_to_job.values())
  
  # best insertion state
  logger.info("Finished best insertion phase")
  for route in all_routes:
    print([step.id for step in route.steps])
  for job in unassigned:
    print("Unassigned job: ")
    print(job.id)

  # build changeable jobs (jobs that aren't completed including those in progress and pending jobs)
  changeable_jobs = []
  for route in request.routes:
    for job in route.steps:
      if job.status == "in_progress":
        changeable_jobs.append(job)
  changeable_jobs.extend(request.jobs)

  # alns
  initial_state = VRPState(
    depots=request.depots,
    routes=all_routes,
    vehicles=request.vehicles,
    jobs=changeable_jobs,
    unassigned=unassigned
  )
  updated_routes, unassigned = alns_optimize(initial_state)

  # alns state
  logger.info("Finished ALNS phase")
  for route in updated_routes:
    print([step.id for step in route.steps])
  for job in unassigned:
    print(job.id)

  # local search and update metadata for all updated routes
  for i, route in enumerate(updated_routes):
    if len(route.steps) == 0:
      updated_routes[i] = Route(vehicle_id=updated_route.vehicle_id, steps=[], distance=0.0, duration=0.0, geometry=Geometry(type="LineString", coordinates=[]))
      continue
    depot = vehicle_id_to_depot[route.vehicle_id]
    vehicle = vehicle_id_to_vehicle[route.vehicle_id]
    updated_route = _intra_route_local_search(route, vehicle, depot)
    points = [depot.location] + [s.location for s in updated_route.steps] + [depot.location]
    geometry, distance, duration = get_directions(points, vehicle.profile)
    updated_routes[i] = Route(vehicle_id=updated_route.vehicle_id, steps=updated_route.steps, distance=distance, duration=duration, geometry=geometry)
    # updated_routes[i] = Route(vehicle_id=updated_route.vehicle_id, steps=updated_route.steps, distance=None, duration=None, geometry=None)

  # local search state
  logger.info("Finished local search phase")
  for route in updated_routes:
    print([step.id for step in route.steps])
  for job in unassigned:
    print(job.id)

  return RoutingResponse(routes=updated_routes, unassigned=unassigned)


def _parse_static_request(request: RoutingRequest):
  D = len(request.depots)
  M = len(request.vehicles)
  N = len(request.jobs)
  vehicle_counts = Counter(v.depot_id for v in request.vehicles)
  num_vehicles = [vehicle_counts.get(d.id, 0) for d in request.depots]
  # print(num_vehicles)
  customers = [j.location for j in request.jobs]
  demands = [j.demand for j in request.jobs]
  depots = [d.location for d in request.depots]
  num_depots = D
  num_customers = N
  # num_vehicles = [d.num_vehicles for d in request.depots]
  route_durations = [0.0]*num_depots
  service_times = [0.0]*num_customers
  vehicle_loads = [request.vehicles[0].capacity]*num_depots # assuming homongenous capacity
  return MDVRPInstance(
    customers,
    depots,
    vehicle_loads,
    route_durations,
    demands,
    service_times, M, N, D,
    num_vehicles,
    num_customers,
    num_depots
  )

def find_remaining_route(route: Route):
  steps = route.steps
  i = 0
  while i < len(steps) and steps[i].status == "completed":
    i += 1

  return steps[i:], i


# local search
def _intra_route_local_search(route, vehicle, depot):
  remaining_steps, remaining_idx = find_remaining_route(route)
  fixed_prefix = route.steps[:remaining_idx]
  segment = remaining_steps

  for operator in [_two_opt, _swap, _relocate]:
    new_segment, improved = operator(segment, vehicle, depot)
    if improved:
      print("Local search improved")
      segment = new_segment
      break  # restart operator loop on first improvement

  route.steps = fixed_prefix + segment
  return route

def _two_opt(steps, vehicle, depot):
  best = steps
  improved = False
  best_dist = _calculate_route_distance([vehicle.location] + [s.location for s in steps] + [depot.location])
  for i in range(1, len(steps) - 1):
    for j in range(i + 1, len(steps)):
      if j - i == 1: continue
      new_steps = steps[:i] + steps[i:j][::-1] + steps[j:]
      new_dist = _calculate_route_distance([vehicle.location] + [s.location for s in new_steps] + [depot.location])
      if new_dist < best_dist:
        best = new_steps
        best_dist = new_dist
        improved = True
  return best, improved

def _swap(steps, vehicle, depot):
  best = steps[:]
  improved = False
  best_dist = _calculate_route_distance([vehicle.location] + [s.location for s in steps] + [depot.location])
  for i in range(len(steps) - 1):
      for j in range(i + 1, len(steps)):
        new_steps = steps[:]
        new_steps[i], new_steps[j] = new_steps[j], new_steps[i]
        new_dist = _calculate_route_distance([vehicle.location] + [s.location for s in new_steps] + [depot.location])
        if new_dist < best_dist:
          best = new_steps
          best_dist = new_dist
          improved = True
  return best, improved

def _relocate(steps, vehicle, depot):
  best = steps[:]
  improved = False
  best_dist = _calculate_route_distance([vehicle.location] + [s.location for s in steps] + [depot.location])
  for i in range(len(steps)):
    for j in range(len(steps)):
      if i == j: continue
      new_steps = steps[:]
      job = new_steps.pop(i)
      new_steps.insert(j, job)
      new_dist = _calculate_route_distance([vehicle.location] + [s.location for s in new_steps] + [depot.location])
      if new_dist < best_dist:
        best = new_steps
        best_dist = new_dist
        improved = True
  return best, improved
