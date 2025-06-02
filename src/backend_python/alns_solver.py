from alns import ALNS
from alns.select import RouletteWheel
from alns.accept import RecordToRecordTravel
from alns.stop import MaxIterations
from api_v2 import Route, Job, Depot, Vehicle
from typing import List, Dict
import copy
import random
from collections import defaultdict


class VRPState:
  def __init__(self, depots: List[Depot], routes: List[Route], vehicles: List[Vehicle], jobs: List[Job], unassigned: List[Job]):
    self.routes = routes
    self.depots = depots
    self.vehicles = vehicles
    self.jobs = jobs
    self.unassigned = unassigned
    vehicle_id_to_depot, vehicle_id_to_vehicle = utils(depots, routes, vehicles, jobs)
    self.vehicle_id_to_depot = vehicle_id_to_depot
    self.vehicle_id_to_vehicle = vehicle_id_to_vehicle
    
  def copy(self):
    return VRPState(
      copy.deepcopy(self.depots), 
      copy.deepcopy(self.routes), 
      copy.deepcopy(self.vehicles), 
      copy.deepcopy(self.jobs), 
      copy.deepcopy(self.unassigned)
    )

  def objective(self):
    return sum(route_remaining_cost(route, self) for route in self.routes)

  def find_route(self, job: Job):
    for route in self.routes:
      for step in route.steps:
        if job.id == step.id:
          return route

    raise ValueError(f"State doesn't contain job: {job}")


def random_removal(state: VRPState, rng: random.Random):
  destroyed = state.copy()
  degree_of_destruction = 0.2
  num_remove = int(len(destroyed.jobs) * degree_of_destruction)

  rng.shuffle(destroyed.jobs)
  removed_jobs = destroyed.jobs[:num_remove]

  for job in removed_jobs:
    destroyed.unassigned.append(job)
    route = destroyed.find_route(job)
    route.steps.remove(job)

  return destroyed


def remove_empty_route(state: VRPState):
  state.routes = [route for route in state.routes if len(route.steps) != 0]
  return state

def greedy_repair(state: VRPState, rng: random.Random):
  rng.shuffle(state.unassigned)

  while len(state.unassigned) != 0:
    job = state.unassigned.pop()
    route, idx = best_insert(job, state)
    if route:
      route.steps.insert(idx, job)
    else: # this can create new route but solver previous phase
      pass

  return state

def best_insert(job: Job, state: VRPState):
  from solver import find_remaining_route
  best_cost, best_route, best_idx = None, None, None

  for route in state.routes:
    remaining_steps, continue_index = find_remaining_route(route)
    for pos in range(len(remaining_steps) + 1):
      if can_insert(job, route, state):
        cost = insert_cost(job, route, pos, state)
        if not best_cost or cost < best_cost:
          best_cost = cost
          best_route = route
          best_idx = pos + continue_index

  return best_route, best_idx

def can_insert(job: Job, route: Route, state: VRPState):
  vehicle = state.vehicle_id_to_vehicle[route.vehicle_id]
  current_load = sum(step.demand for step in route.steps)
  return current_load + job.demand <= vehicle.capacity


def insert_cost(job: Job, route: Route, pos: int, state: VRPState):
  from solver import _calculate_route_distance, find_remaining_route

  depot: Depot = state.vehicle_id_to_depot[route.vehicle_id]
  vehicle: Vehicle = state.vehicle_id_to_vehicle[route.vehicle_id]

  remaining_steps, _  = find_remaining_route(route)
  new_remaining_steps = remaining_steps[:pos] + [job] + remaining_steps[pos:]
  
  old_points = [vehicle.location] + [s.location for s in remaining_steps] + [depot.location]
  new_points = [vehicle.location] + [s.location for s in new_remaining_steps] + [depot.location]

  old_dist = _calculate_route_distance(old_points)
  new_dist = _calculate_route_distance(new_points)

  return new_dist - old_dist


def route_remaining_cost(route: Route, state: VRPState):
  from solver import find_remaining_route, _calculate_route_distance

  remaining_steps, _ = find_remaining_route(route)
  depot: Depot = state.vehicle_id_to_depot[route.vehicle_id]
  vehicle: Vehicle = state.vehicle_id_to_vehicle[route.vehicle_id]

  points = [vehicle.location] + [s.location for s in remaining_steps] + [depot.location]
  cost = _calculate_route_distance(points)

  return cost


def utils(depots: List[Depot], routes: List[Route], vehicles: List[Vehicle], jobs: List[Job]):
  vehicle_id_to_depot = {}
  for v in vehicles:
    for d in depots:
      if d.id == v.depot_id:
        vehicle_id_to_depot[v.id] = d
  
  vehicle_id_to_vehicle = {}
  for v in vehicles:
    vehicle_id_to_vehicle[v.id] = v
    
  return vehicle_id_to_depot, vehicle_id_to_vehicle



def alns_optimize(state: VRPState) -> VRPState:
  alns = ALNS()

  alns.add_destroy_operator(random_removal)
  alns.add_repair_operator(greedy_repair)

  num_iterations = 100

  init = state.copy()
  select = RouletteWheel([25, 5, 1, 0], 0.8, 1, 1)
  accept = RecordToRecordTravel.autofit(
    init.objective(), 0.02, 0, num_iterations
  )
  stop = MaxIterations(num_iterations)

  result = alns.iterate(init, select, accept, stop)
  solution: VRPState = result.best_state

  return solution.routes, solution.unassigned