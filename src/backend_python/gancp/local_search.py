import numpy as np
import random
from .evaluate import single_predict_cost

def relocate(instance, individual):
  best = individual[:]
  best_cost = single_predict_cost(instance, individual)
  improved = False

  num_customers = len(individual)
  num_depots = instance.num_depots

  for i in range(num_customers):
    current_depot = individual[i]
    for new_depot in range(num_depots):
      if new_depot == current_depot:
        continue
      new_ind = best[:]
      new_ind[i] = new_depot
      new_cost = single_predict_cost(instance, new_ind)
      if new_cost < best_cost:
        best = new_ind
        best_cost = new_cost
        improved = True
        return best, improved

  return best, improved


def swap(instance, individual, k=1):
  best = individual[:]
  best_cost = single_predict_cost(instance, best)
  improved = False

  num_customers = len(individual)

  for i in range(num_customers):
    for j in range(i + 1, num_customers):
      if individual[i] == individual[j]:
        continue
      new_ind = best[:]
      new_ind[i], new_ind[j] = new_ind[j], new_ind[i]
      new_cost = single_predict_cost(instance, new_ind)
      if new_cost < best_cost:
        best = new_ind
        best_cost = new_cost
        improved = True
        return best, improved

  return best, improved


def k_swap(instance, individual, k=2):
  best = individual[:]
  best_cost = single_predict_cost(instance, best)
  improved = False

  num_customers = len(individual)
  indices = list(range(num_customers))

  for _ in range(100):
    chosen = random.sample(indices, 2 * k)
    new_ind = best[:]
    for i in range(k):
      a, b = chosen[2 * i], chosen[2 * i + 1]
      if new_ind[a] == new_ind[b]:
        continue
      new_ind[a], new_ind[b] = new_ind[b], new_ind[a]
    new_cost = single_predict_cost(instance, new_ind)
    if new_cost < best_cost:
      best = new_ind
      best_cost = new_cost
      improved = True
      break

  return best, improved

def move_pair(instance, individual):
  best = individual[:]
  best_cost = single_predict_cost(instance, best)
  improved = False

  num_customers = len(individual)
  num_depots = instance.num_depots

  for i in range(num_customers):
    for j in range(i + 1, num_customers):
      if individual[i] == individual[j]:
        continue
      for new_depot in range(num_depots):
        if new_depot == individual[i] and new_depot == individual[j]:
          continue
        new_ind = best[:]
        new_ind[i] = new_depot
        new_ind[j] = new_depot
        new_cost = single_predict_cost(instance, new_ind)
        if new_cost < best_cost:
          best = new_ind
          best_cost = new_cost
          improved = True
          return best, improved

  return best, improved


def partial_reassignment(instance, individual, rate=0.1):
  best = individual[:]
  best_cost = single_predict_cost(instance, best)
  improved = False

  num_customers = len(individual)
  num_depots = instance.num_depots

  num_change = max(1, int(rate * num_customers))
  indices_to_change = random.sample(range(num_customers), num_change)

  new_ind = best[:]
  for idx in indices_to_change:
    new_depot = random.choice([d for d in range(num_depots) if d != new_ind[idx]])
    new_ind[idx] = new_depot

  new_cost = single_predict_cost(instance, new_ind)
  if new_cost < best_cost:
    best = new_ind
    best_cost = new_cost
    improved = True

  return best, improved


def local_search(instance, population, max_iter=10):
  new_population = population[:]
  for i, individual in enumerate(population):
    current = individual[:]
    for _ in range(max_iter):
      operators = [relocate, swap, k_swap, move_pair, partial_reassignment]
      for op in operators:
         current, improved = op(instance, current)
         if improved:
            new_population[i] = current
            return new_population
  
  return new_population
