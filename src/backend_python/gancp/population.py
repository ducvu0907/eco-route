import numpy as np
import random

# TODO: use precomputed distance matrix
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
