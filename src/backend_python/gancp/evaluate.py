from dotenv import load_dotenv
import os
import numpy as np
import dgl
import torch
from .model import Transformer, get_knn_graph
from .read_mdvrp import MDVRPInstance
import hygese as hgs
import math
from .utils import chromosome_to_clusters, coords_to_xy
from typing import Literal
load_dotenv()
pretrained_path = os.getenv("PRETRAINED_PATH")

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = Transformer(in_dim=4, latent_dim=128, n_layers=4).to(device)
state_dict = torch.load(pretrained_path, map_location=torch.device(device))
model.load_state_dict(state_dict)
model.eval()

def batch_prediction(coords, demands, Qs, batch_size, mini_batch_len):
  gs = [None]*batch_size
  meta_data = [None]*batch_size
  cost_scalers = [None]*batch_size
  for i in range(batch_size):
    gs[i], meta_data[i] = get_knn_graph(coord=np.asarray(coords[i]), demand=np.asarray(demands[i]), q=Qs[i])
    cost_scalers[i] = meta_data[i]['cost_scaler']

  predictions = []

  for mini_batch_count in range(0, batch_size, mini_batch_len):  #larger instances ~ more memory 
    mini_batch_min = mini_batch_count
    mini_batch_max = min(batch_size, mini_batch_min+mini_batch_len)
    gs_mini_batch = dgl.batch(gs[mini_batch_min:mini_batch_max]).to(device)
    with torch.no_grad():
      preds = model(gs_mini_batch, gs_mini_batch.ndata['feat'])
    preds = preds.cpu().flatten().numpy()*cost_scalers[mini_batch_min:mini_batch_max]      #.cpu()
    predictions = np.concatenate((predictions, preds)) #torch.cat((predictions, preds), 0) #torch.cuda.empty_cache()

  return predictions


def batch_fitness_cost(instance, population):
  list_len = len(population)
  coords = [None] * (list_len * instance.D)
  demands = [None] * (list_len * instance.D)
  
  # Flatten vehicle loads for all depots, repeated for each individual
  Qs = instance.vehicle_loads * list_len

  for i, individual in enumerate(population, start=1):
    clusters = chromosome_to_clusters(instance, individual)
    depot = 0
    for cluster in clusters:
      depot += 1
      coord = list(np.array(instance.customers)[cluster].copy())
      # Insert depot coordinates at the front
      coord.insert(0, instance.depots[depot - 1])
      coords[(i - 1) * instance.D + depot - 1] = coord
      
      dem = [instance.demands[cust] for cust in cluster]
      dem.insert(0, 0.0)
      demands[(i - 1) * instance.D + depot - 1] = dem

  mini_batch_len = 2

  all_costs = batch_prediction(coords, demands, Qs, list_len * instance.D, mini_batch_len)

  costs = [0.0] * list_len
  for i in range(list_len):
    start_idx = i * instance.D
    end_idx = start_idx + instance.D
    costs[i] = sum(all_costs[start_idx:end_idx])

  return costs


def single_predict(coord, demand, Q):
  model.eval()
  g, meta = get_knn_graph(coord=coord, demand=demand, q=Q)
  g = g.to(device)

  with torch.no_grad():
    pred = model(g, g.ndata['feat'])

  pred_val = pred.cpu().item() * meta['cost_scaler']
  return pred_val


# TODO
def single_fitness_score():
  pass


def diversity(population):
  pop_len = len(population)
  scores = np.empty(pop_len, dtype=float)

  for i in range(pop_len):
    score = 0
    for j in range(pop_len):
      # Hamming distance between population[i] and population[j]
      # sum of positions where elements differ
      diff_count = sum(el1 != el2 for el1, el2 in zip(population[i], population[j]))
      score += diff_count
    scores[i] = score

  return scores / np.sum(scores)


def fitness_scores(costs, diversities, w1, w2, excess_demands, infeas_penalty=0.1):
  costs = np.array(costs, dtype=float)
  costs /= np.sum(costs)

  excess_demands = np.array(excess_demands, dtype=float)
  diversities = np.array(diversities, dtype=float)

  score = w1 * costs - w2 * diversities + infeas_penalty * costs * excess_demands
  return score


def compute_harversine_2d_matrix(xs, ys):
  n = len(xs)
  assert n == len(ys), "Coordinates have different length"

  # Convert degrees to radians
  xs_rad = [math.radians(x) for x in xs]
  ys_rad = [math.radians(y) for y in ys]

  R = 6371.0  # Earth's radius in kilometers

  dist_matrix = [[0.0] * n for _ in range(n)]
  for i in range(n):
    for j in range(n):
      dlat = ys_rad[j] - ys_rad[i]
      dlon = xs_rad[j] - xs_rad[i]
      a = math.sin(dlat / 2)**2 + math.cos(ys_rad[i]) * math.cos(ys_rad[j]) * math.sin(dlon / 2)**2
      c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
      dist_matrix[i][j] = R * c
  return dist_matrix

def compute_euclidean_2d_matrix(xs, ys):
  n = len(xs)
  assert n == len(ys), "Coordinates have different length"
  dist_matrix = [[0.0]*n for _ in range(n)]
  for i in range(n):
    for j in range(n):
      dx = xs[i] - xs[j]
      dy = ys[i] - ys[j]
      dist_matrix[i][j] = (dx**2 + dy**2)**0.5
  return dist_matrix


def hgs_cvrp(instance: MDVRPInstance, hgs_time_limit=1.0, dist_type: Literal["euclidean", "harversine"] = "euclidean"):
  ap = hgs.AlgorithmParameters(timeLimit=hgs_time_limit)
  solver = hgs.Solver(parameters=ap)
  x, y = coords_to_xy(instance.customers)
  demand = instance.demands
  Q = instance.vehicle_loads[0]

  data = dict()
  if dist_type == "euclidean":
    data["distance_matrix"] = compute_euclidean_2d_matrix(x, y)
  else:
    data["distance_matrix"] = compute_harversine_2d_matrix(x, y)

  data["depot"] = 0 
  data["demands"] = demand
  data["num_vehicles"] = instance.num_vehicles[0]
  data["service_times"] = [0.0] * instance.num_customers
  data["vehicle_capacity"] = Q
  solution = solver.solve_cvrp(data)

  return [solution.cost], [solution.routes]

def hgs_solutions(instance, top_solutions, hgs_time_limit, dist_type: Literal["euclidean", "harversine"] = "euclidean"):
  ap = hgs.AlgorithmParameters(timeLimit=hgs_time_limit)
  solver = hgs.Solver(parameters=ap)

  list_len = len(top_solutions)
  customers = list(range(instance.N))
  costs = [0.0] * list_len
  mdvrp_routes = [None] * list_len

  for i, chromosome in enumerate(top_solutions):
    clusters = chromosome_to_clusters(instance, chromosome)
    routes = [None] * len(clusters)
    total_cost = 0

    for idx, cluster in enumerate(clusters):
      if len(cluster) > 1:
        x, y = coords_to_xy([instance.customers[cust] for cust in cluster])
        demand = [instance.demands[cust] for cust in cluster]
        Q = instance.vehicle_loads[idx]

        # Insert depot coordinates at start
        x.insert(0, instance.depots[idx][0])
        y.insert(0, instance.depots[idx][1])

        service_times = [0] * len(x)
        demand.insert(0, 0.0)

        data = dict()
        # data["x_coordinates"] = x
        # data["y_coordinates"] = y
        
        if dist_type == "euclidean":
          data["distance_matrix"] = compute_euclidean_2d_matrix(x, y)
        else:
          data["distance_matrix"] = compute_harversine_2d_matrix(x, y)

        data["depot"] = 0
        data["demands"] = demand
        data["service_times"] = service_times
        # data["num_vehicles"] = instance.M
        data["num_vehicles"] = instance.num_vehicles[idx] # number of vehicles at depot idx
        data["vehicle_capacity"] = Q
        solution = solver.solve_cvrp(data)
        if solution.cost == 0 and len(demand) > 1:
          total_cost = float('inf')
        else:
          total_cost += solution.cost

        # Re-index customers from solver routes to original indexing
        allocated_customers = [0] + [customers[cust] for cust in cluster]
        for r_idx, route in enumerate(solution.routes):
          solution.routes[r_idx] = [allocated_customers[pos] for pos in route]

        routes[idx] = solution.routes
      elif len(cluster) == 1:
        total_cost += 2 * np.linalg.norm(
          np.array(instance.customers[cluster[0]]) - np.array(instance.depots[idx])
        )

    costs[i] = total_cost
    mdvrp_routes[i] = routes

  return costs, mdvrp_routes



# test inference
if __name__ == "__main__":
  coords = np.array([
    [10.0, 10.0],
    [12.0, 18.0],
    [20.0, 25.0],
    [25.0, 12.0],
    [30.0, 30.0],
    [35.0, 20.0],
    [40.0, 10.0],
    [45.0, 25.0],
    [50.0, 15.0],
    [55.0, 30.0],
  ])

  demands = np.array([0, 2, 1, 3, 2, 1, 2, 1, 3, 2])
  Q = 10
  n = len(demands)

  # predict with gancp
  pred = single_predict(coords, demands, Q)
  

  # solve with hgs
  ap = hgs.AlgorithmParameters(timeLimit=1.0)
  solver = hgs.Solver(parameters=ap, verbose=False)

  data = dict()
  data["x_coordinates"] = coords[:, 0]
  data["y_coordinates"] = coords[:, 1]
  data["depot"] = 0
  data["demands"] = demands
  data["vehicle_capacity"] = Q
  data['service_times'] = np.zeros(len(demands))
  result = solver.solve_cvrp(data)

  print(pred)
  print(result.cost)
