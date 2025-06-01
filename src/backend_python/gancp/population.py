import numpy as np
import random
from sklearn.cluster import KMeans

def generate_population(instance, max_pop_limit):
  population = [None] * max_pop_limit

  # parent1: assign customer to nearest depot
  customer_coords = np.array(instance.customers)  # shape (N, 2)
  depot_coords = np.array(instance.depots)       # shape (D, 2)

  # Compute Euclidean distance matrix: customers x depots
  customer_depot_distances = np.linalg.norm(
    customer_coords[:, np.newaxis, :] - depot_coords[np.newaxis, :, :],
    axis=2
  )  # shape (N, D)

  parent1 = np.argmin(customer_depot_distances, axis=1).tolist()
  population[0] = parent1

  # parent2: assign customer to nearest neighbor's nearest depot
  # Compute customer-customer distance matrix
  customer_customer_distances = np.linalg.norm(
    customer_coords[:, np.newaxis, :] - customer_coords[np.newaxis, :, :],
    axis=2
  )
  np.fill_diagonal(customer_customer_distances, np.inf)

  nearest_neighbor_list = np.argmin(customer_customer_distances, axis=1)

  parent2 = [parent1[neighbor] for neighbor in nearest_neighbor_list]
  population[1] = parent2

  # parent3: assign customer to 2nd nearest depot
  if instance.D >= 3:
    parent3 = []
    for i in range(instance.N):
      sorted_distances = np.sort(customer_depot_distances[i])
      second_nearest_dist = sorted_distances[1]  # second smallest
      # find the index of this distance in original row
      second_nearest_depot = np.where(customer_depot_distances[i] == second_nearest_dist)[0][0]
      parent3.append(second_nearest_depot)
    population[2] = parent3
  else:
    population[2] = [random.randint(0, instance.D - 1) for _ in range(instance.N)]

  # create true random parents
  for i in range(3, max_pop_limit):
    population[i] = [random.randint(0, instance.D - 1) for _ in range(instance.N)]

  return population


def generate_subpopulation(instance, population, scores, pop_limit):
  subpopulation = []
  pop_length = len(scores)
  sorted_scores_indices = np.argsort(scores).tolist()

  while len(subpopulation) < pop_limit:
    parents = [None, None]

    # parent1 selected with priority or binary tournament selection (both same here)
    candidates = random.sample(range(pop_length), 2)
    parents[0] = population[sorted_scores_indices[min(candidates)]]

    # parent2
    candidates = random.sample(range(pop_length), 2)
    parents[1] = population[sorted_scores_indices[min(candidates)]]

    # ensure parents are not identical
    while parents[0] == parents[1]:
      candidates = random.sample(range(pop_length), 2)
      parents[1] = population[sorted_scores_indices[min(candidates)]]

    child1 = []
    child2 = []

    for idx in range(instance.N):
      child1.append(parents[random.randint(0, 1)][idx])
      child2.append(parents[random.randint(0, 1)][idx])

    subpopulation.append(child1)
    subpopulation.append(child2)

  # remove duplicates from subpopulation (convert to tuple for hashing)
  unique_subpop = list({tuple(ind): ind for ind in subpopulation}.values())

  return unique_subpop


# ===============
# REFINED SECTION
# ===============

def generate_subpopulation_refined(instance, population, scores, pop_limit):
  subpopulation = []
  pop_length = len(population)
  sorted_indices = np.argsort(scores)
  ranks = np.argsort(np.argsort(scores))
  selection_probs = 1.0 / (1 + ranks)
  selection_probs /= sum(selection_probs)

  # elites = [population[i] for i in sorted_indices[:3]]
  # subpopulation.extend(elites)

  while len(subpopulation) < pop_limit:
    i = np.random.choice(pop_length, p=selection_probs)
    j = np.random.choice(pop_length, p=selection_probs)
    while i == j:
      j = np.random.choice(pop_length, p=selection_probs)
    
    parent1, parent2 = population[i], population[j]
    parents = [parent1, parent2]

    child1 = route_based_crossover(instance, parents[0], parents[1])
    child2 = route_based_crossover(instance, parents[1], parents[0])
    # child1 = []
    # child2 = []
    # for idx in range(instance.N):
    #   child1.append(parents[random.randint(0, 1)][idx])
    #   child2.append(parents[random.randint(0, 1)][idx])

    subpopulation.append(child1)
    subpopulation.append(child2)
  
  unique_subpop = list({tuple(ind): ind for ind in subpopulation}.values())

  return unique_subpop


def route_based_crossover(instance, parent1, parent2):
  N = instance.N
  D = instance.D  # number of depots

  def split_by_depot(solution):
    depot_assignments = {d: [] for d in range(D)}
    for cust, depot in enumerate(solution):
        depot_assignments[depot].append(cust)
    return depot_assignments

  p1_routes = split_by_depot(parent1)
  p2_routes = split_by_depot(parent2)

  child_assignment = [-1] * N
  assigned_customers = set()

  # Step 1: Copy random depot routes from P1
  selected_depots = random.sample(range(D), k=max(1, D // 2))
  for depot in selected_depots:
    for cust in p1_routes[depot]:
      child_assignment[cust] = depot
      assigned_customers.add(cust)

  # Step 2: Fill remaining customers from P2
  for depot in range(D):
    for cust in p2_routes[depot]:
      if cust not in assigned_customers:
        child_assignment[cust] = depot
        assigned_customers.add(cust)

  return child_assignment


# def generate_population_refined(instance, max_pop_limit):
#   population = [None] * max_pop_limit

#   # parent1: assign customer to nearest depot
#   customer_coords = np.array(instance.customers)  # shape (N, 2)
#   depot_coords = np.array(instance.depots)       # shape (D, 2)

#   # Compute Euclidean distance matrix: customers x depots
#   customer_depot_distances = np.linalg.norm(
#     customer_coords[:, np.newaxis, :] - depot_coords[np.newaxis, :, :],
#     axis=2
#   )  # shape (N, D)

#   parent1 = np.argmin(customer_depot_distances, axis=1).tolist()
#   population[0] = parent1

#   # parent2: assign customer to nearest neighbor's nearest depot
#   # Compute customer-customer distance matrix
#   customer_customer_distances = np.linalg.norm(
#     customer_coords[:, np.newaxis, :] - customer_coords[np.newaxis, :, :],
#     axis=2
#   )
#   np.fill_diagonal(customer_customer_distances, np.inf)

#   nearest_neighbor_list = np.argmin(customer_customer_distances, axis=1)

#   parent2 = [parent1[neighbor] for neighbor in nearest_neighbor_list]
#   population[1] = parent2

#   # parent3: assign customer to 2nd nearest depot
#   if instance.D >= 3:
#     parent3 = []
#     for i in range(instance.N):
#       sorted_distances = np.sort(customer_depot_distances[i])
#       second_nearest_dist = sorted_distances[1]  # second smallest
#       # find the index of this distance in original row
#       second_nearest_depot = np.where(customer_depot_distances[i] == second_nearest_dist)[0][0]
#       parent3.append(second_nearest_depot)
#     population[2] = parent3
#   else:
#     population[2] = [random.randint(0, instance.D - 1) for _ in range(instance.N)]

#   # parent4: kmeans
#   def kmeans_based_parent(customers, depots):
#     D = len(depots)
#     kmeans = KMeans(n_clusters=D, n_init=10, random_state=42).fit(customers)
#     labels = kmeans.labels_

#     assignment = []
#     for i in range(len(customers)):
#       customer = customers[i]
#       # Assign to depot closest to customer within that cluster
#       distances = [np.linalg.norm(customer - depot) for depot in depots]
#       assigned_depot = np.argmin(distances)
#       assignment.append(assigned_depot)
#     return assignment

#   parent4 = kmeans_based_parent(customer_coords, depot_coords)
#   population[3] = parent4

#   # create true random parents
#   for i in range(4, max_pop_limit):
#     population[i] = [random.randint(0, instance.D - 1) for _ in range(instance.N)]

#   return population


def assign_without_capacity(instance, depot_scores):
  """
  Assign customers to depots using scores (lower is better), not considering capacity
  depot_scores: shape (N, D), lower = preferred
  """
  N, D = depot_scores.shape

  assignment = [-1] * N
  customer_indices = list(range(N))
  random.shuffle(customer_indices)  # prevent bias

  for i in customer_indices:
    sorted_depots = np.argsort(depot_scores[i])
    assignment[i] = sorted_depots[0]
  return assignment

def assign_with_capacity(instance, depot_scores):
  """
  Assign customers to depots using scores (lower is better), while respecting depot capacity.
  depot_scores: shape (N, D), lower = preferred
  """
  N, D = depot_scores.shape
  depot_remaining = [instance.num_vehicles[d] * instance.vehicle_loads[d] for d in range(D)]
  customer_demand = instance.demands

  assignment = [-1] * N
  customer_indices = list(range(N))
  random.shuffle(customer_indices)  # prevent bias

  for i in customer_indices:
    sorted_depots = np.argsort(depot_scores[i])
    for d in sorted_depots:
      if depot_remaining[d] >= customer_demand[i]:
        assignment[i] = d
        depot_remaining[d] -= customer_demand[i]
        break

  return assignment

def generate_population_refined(instance, max_pop_limit):
  population = [None] * max_pop_limit

  customer_coords = np.array(instance.customers)
  depot_coords = np.array(instance.depots)

  N, D = instance.N, instance.D

  # Compute customer-depot distance matrix
  c_d_dist = np.linalg.norm(customer_coords[:, None, :] - depot_coords[None, :, :], axis=2)
  # print(len(c_d_dist), len(c_d_dist[0]))

  # parent 0: nearest depot
  if random.random() < 0.5:
    population[0] = assign_with_capacity(instance, c_d_dist)
  else:
    population[0] = assign_without_capacity(instance, c_d_dist)

  # parent 1: nearest neighbour assigned depot
  c_c_dist = np.linalg.norm(customer_coords[:, None, :] - customer_coords[None, :, :], axis=2)
  np.fill_diagonal(c_c_dist, np.inf)
  nearest_neighbor = np.argmin(c_c_dist, axis=1)
  neighbor_depots = [population[0][n] for n in nearest_neighbor]
  depot_scores = np.full((N, D), fill_value=1e6)
  for i in range(N):
    depot_scores[i, neighbor_depots[i]] = c_d_dist[i, neighbor_depots[i]]
  if random.random() < 0.5:
    population[1] = assign_with_capacity(instance, depot_scores)
  else:
    population[1] = assign_without_capacity(instance, depot_scores)

  # parent 2: second nearest depot
  second_best_d = np.argsort(c_d_dist, axis=1)[:, 1]
  depot_scores = np.full((N, D), fill_value=1e6)
  for i in range(N):
    depot_scores[i, second_best_d[i]] = c_d_dist[i, second_best_d[i]]
  if random.random() < 0.5:
    population[2] = assign_with_capacity(instance, depot_scores)
  else:
    population[2] = assign_without_capacity(instance, depot_scores)

  # parent 3: kmeans
  from sklearn.cluster import KMeans
  kmeans = KMeans(n_clusters=D, n_init=10, random_state=42).fit(customer_coords)
  labels = kmeans.labels_

  # attempt to assign cluster → depot greedily by centroid
  cluster_to_depot = {}
  for k in range(D):
    cluster_center = kmeans.cluster_centers_[k]
    d = np.argmin([np.linalg.norm(cluster_center - depot) for depot in depot_coords])
    cluster_to_depot[k] = d

  depot_scores = np.full((N, D), fill_value=1e6)
  for i in range(N):
    depot_scores[i, cluster_to_depot[labels[i]]] = c_d_dist[i, cluster_to_depot[labels[i]]]
  if random.random() < 0.5:
    population[3] = assign_with_capacity(instance, depot_scores)
  else:
    population[3] = assign_without_capacity(instance, depot_scores)

  # parent 4: sweeping
  def sweep_assignment(instance):
    assignments = [-1] * N
    depot_remaining = [instance.num_vehicles[d] * instance.vehicle_loads[d] for d in range(D)]
    angles = np.arctan2(customer_coords[:, 1], customer_coords[:, 0])
    sorted_indices = np.argsort(angles)
    for i in sorted_indices:
      best_d = np.argmin(c_d_dist[i])
      for d in np.argsort(c_d_dist[i]):
        if depot_remaining[d] >= instance.demands[i]:
          assignments[i] = d
          depot_remaining[d] -= instance.demands[i]
          break
      if assignments[i] == -1:
        assignments[i] = best_d
    return assignments

  population[4] = sweep_assignment(instance)

  # remaining: random
  for i in range(5, max_pop_limit):
    scores = np.random.rand(N, D)
    if random.random() < 0.5:
      population[i] = assign_without_capacity(instance, scores)
    else:
      population[i] = assign_with_capacity(instance, scores)

  return population
