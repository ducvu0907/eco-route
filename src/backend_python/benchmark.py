from gancp.genetic import solve_instance
from gancp.read_mdvrp import MDVRPInstance, read_mdvrp_vrplib, read_mdvrp_cordeau
from pyvrp import Model, Client, Depot, VehicleType, solve
from pyvrp.stop import MaxIterations, MaxRuntime

def solve_mdvrp_with_pyvrp(instance: MDVRPInstance, max_runtime=10.0):
  model = Model()

  for coords, demand, service_time in zip(instance.customers, instance.demands, instance.service_times):
    model.add_client(
      x=coords[0],
      y=coords[1],
      delivery=demand,
      service_duration=service_time
    )
  
  for depot_idx, depot_coords in enumerate(instance.depots):
    depot = model.add_depot(
      x=depot_coords[0],
      y=depot_coords[1],
    )
    model.add_vehicle_type(
      num_available=instance.num_vehicles[depot_idx],
      start_depot=depot,
      end_depot=depot,
      capacity=instance.vehicle_loads[depot_idx]
    )
  
  
  result = model.solve(MaxRuntime(max_runtime=max_runtime))
  return result.cost(), result.best.routes()

def solve_with_gancp(instance_path):
  instance = read_mdvrp_cordeau(instance_path)
  cost, routes = solve_instance(instance)
  return cost, routes

if __name__ == "__main__":
  instance_path = "/home/ducvu/work/projects/eco-route/src/backend_python/data/mdvrp/pr10"
  cost, routes = solve_with_gancp(instance_path)
  print(f"Cost of the solution: {cost}")