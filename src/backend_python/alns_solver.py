from alns import ALNS
from api_v2 import Route, Job, Depot, Vehicle
from typing import List
import copy

class VRPState():
  def __init__(self, depot: List[Depot], vehicles: List[Vehicle], routes: List[Route], unassigned: List[Job]):
    self.routes = routes
    self.unassigned = unassigned

  def copy(self):
    return VRPState(copy.deepcopy(self.routes), self.unassigned.copy())

  def objective(self):
    pass

  def find_route(self, customer):
    pass


def route_cost(route: Route, depot: Depot):
  pass

