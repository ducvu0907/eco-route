# an attempt to port original cvrp written in cpp to python

from __future__ import annotations
from dataclasses import dataclass, field
from typing import List, Tuple, Set
from collections import deque
from sortedcontainers import SortedList, SortedSet
import random
import time
import math

# constants
PI = 3.14159265359
EPSILON = 0.00001


# algorithm classes
@dataclass(frozen=True)
class Client:
  """
  Represents client/customer in the problem instance
  """
  x_coord: float  # coordinate x
  y_coord: float  # coordinate y
  service_duration: float  # service duration
  demand: float  # demand
  polar_angle: float  # polar angle of the client around the assigned depot, measured in degrees


class Params:
  """
  Stores the parameters of the algorithm
  """

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
    self.is_verbose: bool
    self.algorithm_parameters: AlgorithmParameters

    # adaptive penalties coefficients
    self.penalty_capacity_unit: float
    self.penalty_duration_unit: float

    # start time of the algorithm
    self.start_time: float

    # random number generator
    self.rng: random.Random

    # data of the problem instance
    self.has_duration_constraint: bool
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

    self.__constructor(x_coords, 
                       y_coords, 
                       dist_matrix, 
                       demands,
                       service_durations, 
                       vehicle_capacity, 
                       duration_limit, 
                       num_vehicles, 
                       has_duration_constraint, 
                       is_verbose, 
                       algorithm_paramters)


  def __constructor(self, 
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
                    algorithm_paramters: AlgorithmParameters) -> None:
    
    self.algorithm_parameters = algorithm_paramters
    self.has_duration_constraint = has_duration_constraint
    self.num_vehicles = num_vehicles
    self.duration_limit = duration_limit
    self.vehicle_capacity = vehicle_capacity
    self.dist_matrix = dist_matrix
    self.is_verbose = is_verbose

    self.start_time = time.time()
    self.num_clients = len(demands) - 1  # subtract depot

    self.total_demand = 0.0
    self.max_demand = 0.0

    self.rng = random.Random(self.algorithm_parameters.seed)

    self.are_coordinates_provided = (len(demands) == len(x_coords)) and (len(demands) == len(y_coords))

    # we would use self.num_clients + 1 a lot because it counts the depot as well

    self.clients = [-1] * (self.num_clients + 1)
    for i in range(self.num_clients + 1):
      if self.algorithm_parameters.use_swap_star and self.are_coordinates_provided:
        self.clients[i].x_coord = x_coords[i] 
        self.clients[i].y_coord = y_coords[i] 

        # compute arctan and then convert from radian to degree
        self.clients[i].polar_angle = CircleSector.positive_mod(
          32768.0 * math.atan2(self.clients[i].y_coord - self.clients[0].y_coord, 
                               self.clients[i].x_coord - self.clients[0].x_coord) / PI)
      else:
        self.clients[i].x_coord = 0.0
        self.clients[i].y_coord = 0.0
        self.clients[i].polar_angle = 0.0
      
      self.clients[i].service_duration = service_durations[i]
      self.clients[i].demand = demands[i]
      if self.clients[i].demand > self.max_demand: self.max_demand = self.clients[i].demand
      self.total_demand += self.clients[i].demand

    # TODO: add verbose settings here

    # calculate max distance
    self.max_dist = 0.0
    for i in range(self.num_clients + 1):
      for j in range(self.num_clients + 1):
        if self.dist_matrix[i][j] > self.max_dist: self.max_dist = self.dist_matrix[i][j]
    
    # calculate correlated vertices for each customer (for the granular restriction)
    # basically closest neighborhood restricted by granular search parameter
    # ported directly from cpp implementation
    self.correlated_neighborhood = [[] for _ in range(self.num_clients + 1)]
    set_correlated_vertices: List[SortedSet[int]] = [SortedSet() for _ in range(self.num_clients + 1)]
    order_proximity: List[Tuple[float, int]] = []
    for i in range(1, self.num_clients + 1):
      order_proximity.clear()

      for j in range(1, self.num_clients + 1):
        if i != j:
          order_proximity.append((self.dist_matrix[i][j], j))
        order_proximity.sort()

      for j in range(min(self.algorithm_parameters.granular_search, self.num_clients - 1)):
        set_correlated_vertices[i].add(order_proximity[j][1])
        set_correlated_vertices[order_proximity[j][1]].add(i)
    
    for i in range(1, self.num_clients + 1):
      for x in set_correlated_vertices[i]:
        self.correlated_neighborhood[i].append(x)

    # initialize penalties scale
    self.penalty_duration_unit = 1.0
    self.penalty_capacity_unit = max(0.1, min(1000.0, self.max_dist / self.max_demand))



@dataclass
class Node:
  """
  Data structure represents a node
  """
  is_depot: bool  # if the node the depot or not
  cour: int  # node index
  position: int  # position in the route
  last_tested_ri: int  # when ri moves for this node have been last tested
  next: Node  # next node in the route
  prev: Node  # prev node in the route
  cumulated_load: float  # cumulated load on this route until the customer (including itself) 
  cumulated_time: float  # cumulated time on this route until the customer (including itself) 
  cumulated_reversal_distance: float  # difference of cost if the segment of route (0...cour) is reversed (useful for 2-opt moves with asymmetric problems)
  delta_removal: float  # Difference of cost in the current route if the node is removed (used in SWAP*)

@dataclass
class Route:
  """
  Data structure represents a route
  """
  cour: int  # route index
  num_customers: int  # number of customers visited in the route
  last_modified: int  # when this route has been last modified 
  last_tested_swap_star: int  # when the SWAP* moves for this route have been last tested
  depot: Node  # associated depot
  duration: float  # total time on the route
  load: float  # total load on the route
  reversal_distance: float  # difference of cost if the route is reversed
  penalty: float  # current sum of load and duration penalties
  polar_angle_barycenter: float  # polar angle of the bary center of the route
  sector: CircleSector  # circle sector associated to the set of customers

class ThreeBestInsert:
  """
  Structure used in SWAP* to remember the three best insertion positions of a customer in a given route
  """
  def __init__(self):
    self.last_calculated: int
    self.best_cost: List[float] = [-1] * 3
    self.best_location: List[Node] = [-1] * 3
    self.reset()

  def compare_and_add(self, cost: float, place: Node) -> None:
    """
    Insert a new node
    """
    if cost >= self.best_cost[2]: 
      return
    elif cost >= self.best_cost[1]:
      self.best_cost[2] = cost
      self.best_location[2] = place
    elif cost >= self.best_cost[0]:
      self.best_cost[2] = self.best_cost[1]
      self.best_location[2] = self.best_location[1]
      self.best_cost[1] = cost
      self.best_location[1] = place
    else:
      self.best_cost[2] = self.best_cost[1]
      self.best_location[2] = self.best_location[1]
      self.best_cost[1] = self.best_cost[0]
      self.best_location[1] = self.best_location[0]
      self.best_cost[0] = cost
      self.best_location[0] = place

  def reset(self) -> None:
    """
    Resets the structure
    """
    self.best_cost[0] = 1e30
    self.best_cost[1] = 1e30
    self.best_cost[2] = 1e30
    self.best_location[0] = None
    self.best_location[1] = None
    self.best_location[2] = None

@dataclass
class SwapStarElement:
  """

  """
  move_cost: float = 1e30
  node_u: Node = None
  best_position_u: Node = None
  node_v: Node = None
  best_position_v: Node = None

# TODO
class LocalSearch:
  """
  Provides all functions needed for local search
  """

  def __init__(self, params: Params):
    self.params: Params  # problem parameters
    self.is_search_completed: bool  # whether all moves have been evaluated without success
    self.num_moves: int  # total number of moves (RI and SWAP*) applied during the local search
    self.order_nodes: List[int]  # randomized order for checking nodes in the RI local search
    self.order_routes: List[int]  # randomized order for checking routes in the SWAP* local search
    self.empty_routes: SortedSet[int]  # indices of all empty routes
    self.loop_idx: int  # current loop index
    
    # the solution
    self.clients: List[Node]  # elements representing clients (clients[0] is sentinel and should not be accessed)
    self.depots: List[Node]  # elements representing depots
    self.depots_end: List[Node]  # duplicate of depots to mark the end of the route
    self.routes: List[Route]  # elements representing routes
    self.best_insert_client: List[List[ThreeBestInsert]]  # storing cheapest insertion cost for each route, used in SWAP*

    # temporary variables used in local search loop
    self.node_u: Node
    self.node_x: Node
    self.node_v: Node
    self.node_y: Node

    self.route_u: Route
    self.route_v: Route

    self.node_u_prev_index: int
    self.node_u_index: int
    self.node_x_index: int
    self.node_x_next_index: int

    self.node_v_prev_index: int
    self.node_v_index: int
    self.node_y_index: int
    self.node_y_next_index: int

    self.load_u: float
    self.load_x: float
    self.load_v: float
    self.load_y: float

    self.service_u: float
    self.service_x: float
    self.service_v: float
    self.service_y: float

    self.penalty_capacity_ls: float
    self.penalty_duration_ls: float

    self.intra_route_move: bool
  
  def __constructor(self, params: Params):
    pass

  def set_local_variables_route_u(self):
    pass
  
  def set_local_variables_route_v(self):
    pass

  def penalty_excess_duration(self, my_duration: float) -> float:
    pass
  
  def penalty_excess_load(self, my_load: float) -> float:
    pass
  
  # relocate moves
  def move1(self) -> bool:
    pass

  def move2(self) -> bool:
    pass

  def move3(self) -> bool:
    pass

  # swap moves
  def move4(self) -> bool:
    pass

  def move5(self) -> bool:
    pass

  def move6(self) -> bool:
    pass

  # 2-opt and 2-opt* moves
  def move7(self) -> bool:
    pass

  def move8(self) -> bool:
    pass

  def move9(self) -> bool:
    pass

  # sub-routines for efficient swap* evaluations
  def swap_star(self) -> bool:
    pass

  def get_cheapest_simult_removal(self, u: Node, v: Node, best_position: Node) -> float:
    pass

  def preprocess_insertions(self, r1: Route, r2: Route) -> None:
    pass

  # routines to update the solutions
  @staticmethod
  def insert_node(u: Node, v: Node) -> None:
    pass

  @staticmethod
  def swap_node(u: Node, v: Node) -> None:
    pass

  def update_route_data(self, my_route: Route) -> None:
    pass

  
  def run(self) -> None:
    pass
  
  def load_individual(self) -> None:
    pass

  def export_individual(self) -> None:
    pass



# TODO
@dataclass
class ClientSplit:
  demand: float = 0.0
  service_time: float = 0.0
  d0_x: float = 0.0
  dx_0: float = 0.0
  d_next: float = 0.0

class Split:
  """
  Linear split algorithm
  """

  def __init__(self, params: Params):
    self.params: Params
    self.num_max_vehicles: int
    self.client_split: List[ClientSplit]
    self.sum_distance: List[float]
    self.sum_load: List[float]
    self.sum_service: List[float]
    self.potential: List[List[float]]
    self.pred: List[List[int]]
    self.__constructor(params)

  def __constructor(self, params: Params):
    self.params = params
    self.client_split = [-1] * (params.num_clients + 1)
    self.sum_distance = [0.0] * (params.num_clients + 1)
    self.sum_load = [0.0] * (params.num_clients + 1)
    self.sum_service = [0.0] * (params.num_clients + 1)
    self.potential = [[1e30] * (params.num_clients + 1) for _ in range(params.num_vehicles + 1)]
    self.pred = [[0] * (params.num_clients + 1) for _ in range(params.num_vehicles + 1)]

  def propagate(self, i: int, j: int, k: int) -> bool:
    pass

  def dominate(self, i: int, j: int, k: int) -> bool:
    pass

  def dominate_right(self, i: int, j: int, k: int) -> bool:
    pass

  def split_simple(self, indiv: Individual) -> int:
    pass

  def split_lf(self, indiv: Individual) -> int:
    pass

  def general_split(self, indiv: Individual, num_max_vehicles: int) -> None:
    pass


@dataclass(frozen=True)
class EvalIndiv:
  """
  Solution cost parameters
  """
  penalized_cost: float = 0.0  # penalized cost of the individual
  num_routes: int = 0  # number of routes
  distance: float = 0.0  # total distance
  capacity_excess: float = 0.0  # sum of excess load in all routes
  duration_excess: float = 0.0  # sum of excess duration in all routes
  is_feasible: bool = False  # if the individual is feasible


class Individual:
  """
  Represents the solutions through the search
  Stores complete solutions including trip delimeters along with their associated giant tour
  """

  def __init__(self, params: Params):
    self.eval: EvalIndiv  # solution cost params

    self.chrom_t: List[int] = []  # giant tour representing the individual
    self.chrom_r: List[List[int]] = [[] for _ in range(params.num_vehicles)]  # complete solution for each vehicle

    self.successors: List[int] = [-1 for _ in range(params.num_clients + 1)]  # successor in the solution for each node (can be the depot 0)
    self.predecessors: List[int] = [-1 for _ in range(params.num_clients + 1)]  # predecessor in the solution for each node (can be the depot 0)

    self.individuals_per_proximity: SortedList[Tuple[float, Individual]] = SortedList(key=lambda x: x[0])  # other individuals in the population, ordered by increasing proximity
    self.biased_fitness: float  # biased fitness of the solution

    # initialize a random giant tour
    for i in range(params.num_clients):
      self.chrom_t.append(i + 1)
    random.shuffle(self.chrom_t)


  def evaluate_complete_cost(self, params: Params) -> None:
    self.eval = EvalIndiv()

    for r in range(params.num_vehicles):
      if self.chrom_r[r]:
        distance = 0
        load = 0
        service_duration = 0

        # the original implementation doesn't include depot as the first and last stops
        # but here im including both so we only need one for loop
        # the last stop is the depot so load and service duration aren't considered
        for i in range(1, len(self.chrom_r[r])):
          distance += params.dist_matrix[self.chrom_r[r][i - 1]][self.chrom_r[r][i]]

          if i < len(self.chrom_r[r]) - 1:
            load += params.clients[self.chrom_r[r][i]].demand

          if i < len(self.chrom_r[r]) - 1:
            self.successors[self.chrom_r[r][i]] = self.chrom_r[r][i - 1]

          if i > 1:
            self.predecessors[self.chrom_r[r][i - 1]] = self.chrom_r[r][i]

          if i < len(self.chrom_r[r]) - 1:
            service_duration += params.clients[self.chrom_r[r][i]].service_duration

        self.eval.distance += distance
        self.eval.num_routes += 1

        if load > params.vehicle_capacity:
          self.eval.capacity_excess += load - params.vehicle_capacity

        if service_duration > params.duration_limit:
          self.eval.duration_excess += service_duration - params.duration_limit

    # self.eval.penalized_cost = self.eval.distance + self.eval.capacity_excess*params.penalty_capacity_unit + self.eval.duration_excess*params.penalty_duration_unit
    self.eval.penalized_cost = self.eval.distance + self.eval.capacity_excess * params.penalty_capacity_unit
    self.eval.is_feasible = self.eval.capacity_excess < EPSILON


# TODO
class Population:
  """
  Holds the two subpopulations
  Memorizes distance between solutions used in diversity calculations
  """

  def __init__(self, params: Params, split: Split, local_search: LocalSearch):
    pass

  def __del__(self):
    pass

  def update_biased_fitness(self) -> None:
    pass

  def remove_worst_biased_fitness(self) -> None:
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


# TODO
class Genetic:
  """
  Contains the main structure of the genetic algorithm and the crossover operator
  """

  def __init__(self, params: Params):
    self.params = params
    self.split = Split(self.params)
    self.local_search: LocalSearch = LocalSearch(self.params)
    self.population: Population = Population(self.params, self.split, self.local_search)
    self.offspring: Individual = Individual(self.params)

  def crossover_ox(self, result: Individual, parent1: Individual, parent2: Individual) -> None:
    pass

  def run(self) -> None:
    pass


class CircleSector:
  """
  A simple data structure represents circle sectors
  Angles are measured in [0, 65535]
  Contains elementary routines to calculate polar sectors and their intersections for SWAP*
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
  Main configuration parameters of the algorithm
  """
  granular_search: int = 20  # granular search parameters, limits the number of moves in the RI local search
  population_size: int = 25  # minimum population size
  generation_size: int = 40  # generation size (max population size = min population size + generation size)
  num_elites: int = 4  # number of elite individuals
  num_closes: int = 5  # number of closest individuals considered when calculating diversity contribution

  num_iters_penalty: int = 100  # number of iterations between penalty updates
  target_feasible_ratio: float = 0.2  # target proportion for the number of feasible individuals, used to adapt penalty params
  penalty_decrease: float = 0.85  # multiplier used for decrease penalty parameters if there are sufficient feasible individuals
  penalty_increase: float = 1.2  # multiplier used for increase penalty parameters if there are insufficient feasible individuals

  seed: int = 0  # random seed
  num_iters: int = 20000  # number of iterations without improvement until termination (or restart if a time limit is specified)
  num_iters_trace: int = 500  # number of iterations between traces
  time_limit: int = 0  # time limit until termination (0 = inactive)
  use_swap_star: bool = True  # use SWAP* local search or not, only available when coordinates are provided

  def print_algorithm_parameters(self) -> None:
    """
    Utility for printing algorithm configuration parameters
    """
    print("=========== Algorithm Parameters =================")
    print(f"---- Granular Search Level        : {self.granular_search}")
    print(f"---- Population Size (mu)         : {self.population_size}")
    print(f"---- Generation Size (lambda)     : {self.generation_size}")
    print(f"---- Number of Elites             : {self.num_elites}")
    print(f"---- Closest Individuals Count    : {self.num_closes}")
    print(f"---- Penalty Update Interval      : {self.num_iters_penalty}")
    print(f"---- Target Feasible Ratio        : {self.target_feasible_ratio}")
    print(f"---- Penalty Decrease Factor      : {self.penalty_decrease}")
    print(f"---- Penalty Increase Factor      : {self.penalty_increase}")
    print(f"---- Random Seed                  : {self.seed}")
    print(f"---- Max Iterations               : {self.num_iters}")
    print(f"---- Trace Interval               : {self.num_iters_trace}")
    print(f"---- Time Limit (0 = no limit)    : {self.time_limit}")
    print(f"---- Use SWAP* Local Search       : {self.use_swap_star}")
    print("==================================================")


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
  num_clients: int  # number of clients
  duration_limit: float = 1e30  # route duration limit
  vehicle_capacity: float = 1e30  # vehicle capacity
  has_duration_constraint: bool = False  # if the instance has duration constraint


# main
if __name__ == "__main__":
  pass
