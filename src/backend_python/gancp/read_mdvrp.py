class MDVRPInstance:
  def __init__(
      self, 
      customers, 
      depots, 
      vehicle_loads, 
      route_durations, 
      demands, 
      service_times, M, N, D, 
      num_vehicles, 
      num_customers, 
      num_depots):
    self.customers = customers
    self.depots = depots
    self.vehicle_loads = vehicle_loads
    self.route_durations = route_durations
    self.demands = demands
    self.service_times = service_times
    self.M = M  # number of vehicles
    self.N = N  # number of customers
    self.D = D  # number of depots
    self.num_vehicles = num_vehicles # an array of number of vehicles for each depot
    self.num_customers = num_customers
    self.num_depots = num_depots
  def __str__(self):
    lines = [
      f"MDVRP Instance",
      f"  Depots: {self.D} (vehicles per depot: {self.num_vehicles})",
      f"  Total vehicles: {sum(self.num_vehicles)}",
      f"  Customers: {self.N}",
      f"  Load capacity per vehicle: min {min(self.vehicle_loads)}, max {max(self.vehicle_loads)}",
      f"  Customer demand: min {min(self.demands)}, max {max(self.demands)}",
      f"  Service times: min {min(self.service_times)}, max {max(self.service_times)}",
    ]
    return "\n".join(lines)

def read_mdvrp_cordeau(file_name):
  with open(file_name, 'r') as f:
    lines = f.readlines()

  header = lines[0].split()
  print(header)
  M = int(header[1])
  N = int(header[2])
  D = int(header[3])

  vehicle_loads = [0] * D
  route_durations = [0] * D

  for i in range(1, D + 1):
    parts = lines[i].split()
    route_durations[i - 1] = int(parts[0])
    vehicle_loads[i - 1] = int(parts[1])

  depots = [[0.0, 0.0] for _ in range(D)]
  for i in range(1 + D + N, 1 + D + N + D):
    line = lines[i].split()
    line = [x for x in line if x != '']
    depots[i - N - D - 1][0] = float(line[1])
    depots[i - N - D - 1][1] = float(line[2])

  customers = [[0.0, 0.0] for _ in range(N)]
  demands = [0] * N
  service_times = [0] * N

  for i in range(N):
    line = lines[1 + D + i].split()
    line = [x for x in line if x != '']

    customer_id = int(line[0]) - 1
    x_coord = float(line[1])
    y_coord = float(line[2])
    service_time = int(float(line[3]))
    demand = int(float(line[4]))

    customers[customer_id] = [x_coord, y_coord]
    demands[customer_id] = demand
    service_times[customer_id] = service_time

  num_vehicles = [M]*D
  num_customers = N
  num_depots = D
  return MDVRPInstance(
    customers, 
    depots, 
    vehicle_loads, 
    route_durations, 
    demands, 
    service_times, M, N, D, 
    num_vehicles, 
    num_customers, 
    num_depots)

def read_mdvrp_vrplib(file_name):
  from vrplib import read_instance
  from collections import Counter
  instance = read_instance(file_name)
  node_coords = instance["node_coord"]
  depot_indexes = instance["depot"]
  D = num_depots = len(depot_indexes)
  depots = node_coords[:D]
  vehicles_depot = instance["vehicles_depot"]
  customers = node_coords[D:]
  capacity = instance["capacity"]
  duration = instance["vehicles_max_duration"]
  M = instance["vehicles"] # this is not correct in the context of file benchmark
  vehicles_counter = Counter(vehicles_depot)
  num_vehicles = [vehicles_counter[i+1] for i in depot_indexes]
  route_durations = [duration]*num_depots
  vehicle_loads = [capacity]*num_depots
  N = num_customers = len(node_coords) - len(depots)
  service_times = [0.0]*num_customers
  demands = instance["demand"][D::] # remove default demands for depot

  return MDVRPInstance(
    customers, 
    depots, 
    vehicle_loads, 
    route_durations, 
    demands, 
    service_times, M, N, D, 
    num_vehicles, 
    num_customers, 
    num_depots)


if __name__ == "__main__":
  instance = read_mdvrp_vrplib("/home/ducvu/work/projects/eco-route/src/backend_python/data/mdvrptw/PR11A.vrp")
  print(instance)
