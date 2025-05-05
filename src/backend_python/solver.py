import numpy as np
import hygese as hgs
import math
import os
import subprocess
from api import Route, RoutingRequest, RoutingResponse, logger
from typing import List, Dict
from collections import defaultdict
from vrplib import read_instance, read_solution


def solve_cli_with_binary(instance_path, time_limit=3, seed=0, verbose=1):
  """
  """
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

def solve_cli_with_hygese(instance_path, time_limit=3, seed=0, verbose=1):
  """
  """
  try:
    instance = read_instance(instance_path)
    distance_matrix = instance["edge_weight"]
    demands = instance["demand"]
    depot = instance["depot"][0] # only support single-depot
    vehicle_capacity = instance["capacity"]
    n = len(demands)

    data = {
      "service_times": np.zeros(n),
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


def solve_api(request: RoutingRequest):
  """
  Entrypoint for VRP HTTP request. 
  """
  if not request.routes:
    return solve_static(request)
  else:
    return solve_dynamic(request)


def solve_dynamic(request: RoutingRequest):
  """
  """
  pass


def solve_static(request: RoutingRequest):
  """
  Solving static Multi-Depot VRP.

  Parameters:
  ----------
  request : RoutingRequest
    A request object containing vehicles, jobs, and (optionally) routes.

  Returns:
  -------
  RoutingResponse
    An object containing optimized routes and total distance.
  """
  logger.info("Received request for VRP solving.")
  depots_vehicles, customers_jobs = _parse_static_request(request)
  depot_coords = list(depots_vehicles.keys())
  customer_coords = list(customers_jobs.keys())

  logger.info(f"Parsed {len(depot_coords)} depot(s) and {len(customer_coords)} customer(s).")
  clusters = _clustering_greedy(depot_coords, customer_coords)
  logger.info(f"Generated {len(clusters)} cluster(s) based on depots.")

  total_cost = 0.0
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
    distance_matrix = _convert_coords_to_distance_matrix(depot, customers)
    num_vehicles = len(depots_vehicles[depot])
    demands = [0] + [customers_jobs[c].demand for c in customers] # demand[depot] set to 0
    vehicle_capacity = sum([v.capacity for v in depots_vehicles[depot]]) / num_vehicles # taking average capacity

    logger.info(f"Depot {depot} — Vehicles: {num_vehicles}, Capacity per vehicle: {vehicle_capacity}")
    logger.info(f"Distance matrix size: {len(distance_matrix)}x{len(distance_matrix[0])}, Demands: {demands}")
    
    result = _solve_cvrp_with_hygese(distance_matrix, demands, vehicle_capacity, num_vehicles)
    logger.info(f"Solved cluster for depot {depot}. Cost: {result.cost}, Routes: {result.routes}")

    total_cost += result.cost
    
    # parse to route response
    # we assume vehicles are all the same (mostly yes)
    # so we simply assign vehicle in order
    # also note that we might not use all of the vehicles
    vehicles = depots_vehicles[depot]
    for i, route in enumerate(result.routes):
      steps = []
      for r in route:
        customer = customers[r - 1]
        steps.append(customers_jobs[customer])
        
      route_response = Route(
        vehicle_id=vehicles[i].id, 
        steps=steps
        )

      all_routes.append(route_response)
      
  return RoutingResponse(routes=all_routes, total_distance=total_cost)


def _haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float):
  """
  Computes the great-circle distance between two geographic coordinates.

  Returns:
  -------
  float
    Distance in kilometers.
  """
  R = 6371
  phi1 = math.radians(lat1)
  phi2 = math.radians(lat2)
  delta_phi = math.radians(lat2 - lat1)
  delta_lambda = math.radians(lon2 - lon1)
  a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
  c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
  return R * c


def _convert_coords_to_distance_matrix(depot: List[float], customers: List[List[float]]):
  """
  Builds a symmetric distance matrix for a depot and its customers.

  Parameters:
  ----------
  depot : List[float]
    Latitude and longitude of the depot.
  customers : List[List[float]]
    List of [lat, lon] for customers.

  Returns:
  -------
  List[List[float]]
    Symmetric matrix where entry [i][j] is the distance between node i and j.
  """
  points = [depot] + customers
  n = len(points)
  distance_matrix = [[0.0] * n for _ in range(n)]

  for i in range(n):
    for j in range(i + 1, n):
      lat1, lon1 = points[i]
      lat2, lon2 = points[j]
      dist = _haversine_distance(lat1, lon1, lat2, lon2)
      distance_matrix[i][j] = dist
      distance_matrix[j][i] = dist

  return distance_matrix


def _parse_static_request(request: RoutingRequest):
  """
  Extracts and structures vehicle and job information for clustering.

  Parameters:
  ----------
  request : RoutingRequest

  Returns:
  -------
  Tuple[Dict[Tuple[float, float], List[Vehicle]], Dict[Tuple[float, float], Job]]
    - depots_vehicles maps depot coordinates to lists of vehicles
    - customers_demands maps job coordinates to Job objects
  """
  depots_vehicles = defaultdict(list)
  customers_demands = dict()

  for v in request.vehicles:
    lat, lon = v.start.lat, v.start.lon
    depots_vehicles[(lat, lon)].append(v)

  for j in request.jobs:
    lat, lon = j.location.lat, j.location.lon
    customers_demands[(lat, lon)] = j

  logger.info(f"Extracted {len(depots_vehicles)} depots and {len(customers_demands)} jobs from request.")
  return depots_vehicles, customers_demands


def _clustering_greedy(depot_coords: List[List[float]], customer_coords: List[List[float]]):
  """
  Assigns each customer to the closest depot using greedy distance-based logic.

  Parameters:
  ----------
  depot_coords : List[List[float]]
    Coordinates of depots.
  customer_coords : List[List[float]]
    Coordinates of customers.

  Returns:
  -------
  Dict[Tuple[float, float], List[Tuple[float, float]]]
    Mapping of depot coordinates to customer coordinates.
  """
  clusters = defaultdict(list)

  for coord in customer_coords:
    customer_lat, customer_lon = coord
    min_distance = float('inf')
    closest_depot = None

    for depot in depot_coords:
      depot_lat, depot_lon = depot
      distance = _haversine_distance(customer_lat, customer_lon, depot_lat, depot_lon)
      if distance < min_distance:
        min_distance = distance
        closest_depot = depot

    clusters[closest_depot].append(coord)

  logger.info(f"Clustering result: {dict((k, len(v)) for k, v in clusters.items())}")
  return clusters


def _solve_cvrp_with_hygese(distance_matrix: List[List[float]], demands: List[float], vehicle_capacity: float, num_vehicles: int):
  """
  Solves a Capacitated Vehicle Routing Problem using Hygese.

  Parameters:
  ----------
  distance_matrix : List[List[float]]
    Symmetric matrix of pairwise distances.
  demands : List[float]
    Demand for each node (0 for depot at index 0).
  vehicle_capacity : float
    Maximum load per vehicle.
  num_vehicles : int
    Total number of vehicles available.

  Returns:
  -------
  dict
    Solver result including 'cost' and 'routes' keys.
  """
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


# TODO
def _solve_with_pyvrp():
  """
  Solving VRP instance with pyvrp.
  """
  pass
