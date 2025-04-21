# an attempt to port original cvrp written in cpp to python

from __future__ import annotations # forward declaring
from dataclasses import dataclass, field
from typing import List
from collections import deque
import random
import time


# constants
PI = 3.14159265359
EPSILON = 0.00001


# algorithm classes
@dataclass(frozen=True)
class Client:
  """
  """
  x_coord: float # coordinate x
  y_coord: float # coordinate y
  service_duration: float # service duration
  demand: float # demand

class Params:
  """
  """
  # TODO
  def __init__(self, 
               x_coords: List[float], 
               y_coords: List[float],
               dist_matrix: List[List[float]],
               service_durations: List[float],
               demands: List[float],
               vehicle_capacity: float,
               duration_limit: float,
               num_vehicles: int,
               has_duration_constraint: bool,
               is_verbose: bool,
               algorithm_paramters: AlgorithmParameters):

    # algorithm params
    self.is_verbose: bool = is_verbose # verbose level
    self.algorithm_parameters: AlgorithmParameters = algorithm_paramters # main params

    # adaptive penalties coefficients
    self.penalty_capacity_unit: float
    self.penalty_duration_unit: float

    # start time of the algorithm
    self.start_time: float = time.time()

    # random number generator
    self.rng: random.Random = random.Random()

    # data of the problem instance
    self.has_duration_constraint: bool = has_duration_constraint
    self.num_clients: int
    self.num_vehicles: int
    self.duration_limit: float
    self.vehicle_capacity: float
    self.total_demand: float
    self.max_demand: float
    self.max_dist: float
    self.clients: List[Client]
    self.dist_matrix: List[List[float]]
    self.correlated_neighborhood: List[List[int]]
    self.are_coordinates_provided: bool



# TODO: implement local search core
class LocalSearch:
  """
  """
  def __init__(self):
    pass


# TODO: implement split algorithm
class Split:
  """
  """
  def __init__(self):
    pass


@dataclass(frozen=True)
class EvalIndiv:
  """
  Individual cost parameters
  """
  penalized_cost: float = 0.0 # penalized cost of the individual
  num_routes: int = 0 # number of routes
  distance: float = 0.0 # total distance
  capacity_excess: float = 0.0 # sum of excess load in all routes
  duration_excess: float = 0.0 # sum of excess duration in all routes
  is_feasible: bool = False # if the individual is feasible

class Individual:
  """
  """
  def __init__(self, params: Params):
    self.eval: EvalIndiv # solution cost params
    self.chrom_t: List[int] # giant tour representing the individual
    self.chrom_r: List[List[int]] # complete solution for each vehicle
    self.successors: List[int] # successor in the solution for each node (can be the depot 0)
    self.predecessors: List[int] # predecessor in the solution for each node (can be the depot 0)
    self.individuals_per_proximity: any # TODO: what data structure to be ported from multiset ?
    self.biased_fitness: float # biased fitness of the solution

  
  def evaluate_complete_cost(self, params: Params) -> None:
    pass


class Population:
  """
  Population of the genetic algorithm
  """
  def __init__(self, params: Params, split: Split, local_search: LocalSearch):
    pass

  def __del__(self):
    pass

  def __update_biased_fitness(self) -> None:
    pass

  def __remove_worst_biased_fitness(self) -> None:
    pass

  def generate_population(self) -> None:
    pass

  def add_individual(self) -> bool:
    pass

  def restart(self) -> bool:
    pass

  def manage_penalties(self) -> None:
    pass

  def print_state(self) -> None:
    pass

  def broken_pair_distance(self) -> float:
    pass

  def average_broken_pair_distance_closest(self) -> float:
    pass

  def get_diversity(self) -> float:
    pass

  def get_average_cost(self) -> float:
    pass

  def export_search_progress(self) -> None:
    pass

  def export_cvrp_lib_format(self) -> None:
    pass

  def get_binary_tournament(self) -> Individual:
    pass

  def get_best_feasible(self) -> Individual:
    pass

  def get_best_infeasible(self) -> Individual:
    pass

  def get_best_found(self) -> Individual:
    pass


class Genetic:
  """
  Genetic algorithm
  """
  def __init__(self, params: Params):
    self.params = params
    self.split = Split()
    self.local_search = LocalSearch()
    self.population = Population()
    self.offspring = Individual()

  def crossover_ox(self, result: Individual, parent1: Individual, parent2: Individual) -> None:
    pass

  def run(self) -> None:
    pass



class CircleSector:
  """
  A simple data structure to represent circle sectors
  Angles are measured in [0, 65535] instead of [0, 359]
  """
  def __init__(self, point: int):
    self.start = point
    self.end = point

  @staticmethod
  def positive_mod(i: int) -> int:
    """
    Positive modulo 65536
    """
    return (i % 65536 + 65536) % 65536

  @classmethod
  def overlap(cls, sector1: CircleSector, sector2: CircleSector) -> bool:
    """
    Check if 2 sectors overlap
    Basically if sector 1 contains sector 2 start or vice versa
    """
    return cls.positive_mod(sector2.start - sector1.start) <= cls.positive_mod(sector1.end - sector1.start) \
    or cls.positive_mod(sector1.start - sector2.start) <= cls.positive_mod(sector2.end - sector2.start)

  def is_enclosed(self, point: int) -> bool:
    """
    Check if a point is enclosed in the circle sector
    Dist between point and start smaller than dist between end and start
    """
    return self.positive_mod(point - self.start) <= self.positive_mod(self.end - self.start)

  def extend(self, point: int) -> None:
    """
    Extend the circle sector to include an additional point in the smallest arc
    """
    if not self.is_enclosed(point):
      # if point is closer to end we extend end else we extend start
      if self.positive_mod(point - self.end) <= self.positive_mod(self.start - point):
        self.end = point
      else:
        self.start = point


@dataclass(frozen=True)
class AlgorithmParameters:
  """
  Algorithm configuration parameters
  """
  granular_search: int = 20 # granular search parameters, limits the number of moves in the RI local search
  population_size: int = 25 # minimum population size
  generation_size: int = 40 # generation size (max population size = min population size + generation size)
  num_elites: int = 4 # number of elite individuals
  num_closes: int = 5 # number of closest individuals considered when calculating diversity contribution

  num_iters_penalty: int = 100 # number of iterations between penalty updates
  target_feasible_ratio: float = 0.2 # target proportion for the number of feasible individuals, used to adapt penalty params
  penalty_decrease: float = 0.85 # multiplier used for decrease penalty parameters if there are sufficient feasible individuals
  penalty_increase: float = 1.2 # multiplier used for increase penalty parameters if there are insufficient feasible individuals

  seed: int = 0 # random seed
  num_iters: int = 20000 # number of iterations without improvement until termination (or restart if a time limit is specified)
  num_iters_trace: int = 500 # number of iterations between traces
  time_limit: int = 0 # time limit until termination (0 = inactive)
  use_swap_star: bool = True # use SWAP* local search or not, only available when coordinates are provided


@dataclass(frozen=True)
class Instance:
  """
  Problem instance constraints
  """
  x_coords: List[float]
  y_coords: List[float]
  dist_matrix: List[List[float]]
  service_durations: List[float]
  demands: List[float]
  num_clients: int # number of clients
  duration_limit: float = 1e30 # route duration limit
  vehicle_capacity: float = 1e30 # vehicle capacity
  has_duration_constraint: bool = False # if the instance has duration constraint




# main
if __name__ == "__main__":
  pass
