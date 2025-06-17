from gancp.genetic import solve_instance
from gancp.read_mdvrp import MDVRPInstance, read_mdvrp_vrplib, read_mdvrp_cordeau
from pyvrp import Model, Client, Depot, VehicleType, solve
from pyvrp.stop import MaxIterations, MaxRuntime
from gancp.genetic import benchmark_instance

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


def benchmark(folder_path, output_csv='benchmark_results.csv'):
    import csv
    import os
    # Remove existing file if it exists to avoid duplicate headers
    # if os.path.exists(output_csv):
    #     os.remove(output_csv)

    files = [
        os.path.join(folder_path, f)
        for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f)) and not f.endswith('.res')
    ]

    for i, f in enumerate(files):
        instance = read_mdvrp_cordeau(f)
        cost, cost_refined = benchmark_instance(instance)
        print(cost, cost_refined)

        # Write to CSV immediately
        write_header = i == 0  # Only write header for the first file
        with open(output_csv, mode='a', newline='') as csvfile:
            writer = csv.writer(csvfile)
            if write_header:
                writer.writerow(['Filename', 'Cost', 'Cost_Refined'])
            writer.writerow([os.path.basename(f), cost, cost_refined])

    return "Benchmark completed and saved incrementally."

if __name__ == "__main__":
  # folder1 = "/home/ducvu/work/projects/eco-route/src/backend_python/data/mdvrp"
  folder2 = "/home/ducvu/work/projects/eco-route/src/backend_python/data/T_instances"
  file = "/home/ducvu/work/projects/eco-route/src/backend_python/data/T_instances/T003-n127-d2.txt"
  benchmark(folder2)
  # cost, _ = solve_with_gancp(file)
  # print(cost)