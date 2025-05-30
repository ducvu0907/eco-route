from gancp.genetic import solve_instance
from gancp.read_mdvrp import read_mdvrp_vrplib, read_mdvrp_cordeau
from pyvrp import Model, read
from pyvrp.stop import MaxIterations, MaxRuntime

def solve_with_pyvrp(instance):
  pass

def solve_with_gancp(instance_path):
  instance = read_mdvrp_cordeau(instance_path)
  cost, routes = solve_instance(instance)
  print(cost)
  print(routes)

if __name__ == "__main__":
  instance_path = "/home/ducvu/work/projects/eco-route/src/backend_python/data/mdvrp/p02"
  solve_with_gancp(instance_path)