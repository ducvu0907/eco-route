import random
import copy

def chromosome_to_clusters(instance, chromosome):
  # Convert chromosome (list of depot indices) to clusters
  clusters = [[] for _ in range(instance.D)]
  for node in range(instance.N):
    depot = chromosome[node]
    clusters[depot].append(node)
  return clusters

def clusters_to_chromosome(instance, clusters):
  # Convert clusters (grouped customer indices) to a chromosome
  individual = [0] * instance.N
  for depot_index, cluster in enumerate(clusters):
    for customer in cluster:
      individual[customer] = depot_index
  return individual

def coords_to_xy(coords):
  # Separate coordinate pairs into x and y lists
  x = [int(coord[0]) for coord in coords]
  y = [int(coord[1]) for coord in coords]
  return x, y

def delete_duplicates(population, costs):
  # Remove duplicate individuals in the population
  seen = {}
  unique_indices = []
  for i, individual in enumerate(population):
    key = tuple(individual)
    if key not in seen:
      seen[key] = i
      unique_indices.append(i)
  population_new = [population[i] for i in unique_indices]
  costs_new = [costs[i] for i in unique_indices]
  return population_new, costs_new

def are_infeasibles(instance, population):
  infeasibilities = [False] * len(population)
  excess_demands = [0] * len(population)
  for i, individual in enumerate(population):
    clusters = chromosome_to_clusters(instance, individual)
    infeasible = False
    excess_demand = 0
    for depot_index, cluster in enumerate(clusters):
      # depot_capacity = instance.M * instance.vehicle_loads[depot_index]
      depot_capacity = instance.num_vehicles[depot_index] * instance.vehicle_loads[depot_index]
      total_demand = sum(instance.demands[c] for c in cluster)
      if total_demand > depot_capacity:
        infeasible = True
        excess_demand += total_demand - depot_capacity
    infeasibilities[i] = infeasible
    excess_demands[i] = excess_demand
  return infeasibilities, excess_demands

def repair_infeasibles(instance, population, infeasibilities, excess_demands, prob_repair):
  for index, infeasible in enumerate(infeasibilities):
    if infeasible and random.random() < prob_repair:
      population[index] = improve_infeasible(instance, population[index])
      excess_demands[index] = 0
      infeasibilities[index] = False
  return population, infeasibilities, excess_demands

def is_route_feasible(instance, cluster, depot):
  current_load = sum(instance.demands[c] for c in cluster)
  # feasible = current_load <= instance.M * instance.vehicle_loads[depot]
  feasible = current_load <= instance.num_vehicles[depot] * instance.vehicle_loads[depot]
  return current_load, feasible

def improve_infeasible(instance, individual):
  clusters = chromosome_to_clusters(instance, individual)
  depots = instance.D
  current_loads = [0] * depots
  feasibilities = [False] * depots

  for depot in range(depots):
    current_loads[depot], feasibilities[depot] = is_route_feasible(instance, clusters[depot], depot)

  while sum(feasibilities) < depots:
    depot = feasibilities.index(False)
    if not clusters[depot]:
      feasibilities[depot] = True
      continue

    customer = random.choice(clusters[depot])
    clusters[depot].remove(customer)
    current_loads[depot], feasibilities[depot] = is_route_feasible(instance, clusters[depot], depot)

    for new_depot in range(depots):
      # if feasibilities[new_depot] and current_loads[new_depot] + instance.demands[customer] <= instance.M * instance.vehicle_loads[new_depot]:
      #   clusters[new_depot].append(customer)
      #   current_loads[new_depot] += instance.demands[customer]
      #   break
      if feasibilities[new_depot] and current_loads[new_depot] + instance.demands[customer] <= instance.num_vehicles[new_depot] * instance.vehicle_loads[new_depot]:
        clusters[new_depot].append(customer)
        current_loads[new_depot] += instance.demands[customer]
        break


  return clusters_to_chromosome(instance, clusters)


# ===============
# REFINED SECTION
# ===============
def compute_adaptive_repair_prob_avg_excess(generation, generations, avg_excess, base_prob=0.5, max_prob=0.8):
    # Increase over time + respond to high excess demand
  time_factor = generation / generations
  excess_factor = min(1.0, avg_excess / 100.0)  # normalize based on threshold

  adaptive_prob = base_prob + 0.5 * time_factor + 0.5 * excess_factor
  return min(max_prob, adaptive_prob)

def compute_adaptive_repair_prob_infeasible_ratio(generation, generations, infeasible_ratio, base=0.5, max_p=0.8):
  slope = (max_p - base)
  return min(max_p, base + slope * (infeasible_ratio + generation / generations))

def repair_infeasibles_refined(instance, population, infeasibilities, excess_demands, generation=0, generations=10):
  infeasible_ratio = sum(infeasibilities) / len(infeasibilities)
  avg_excess = sum(excess_demands) / len(population)

  repair_prob = compute_adaptive_repair_prob_infeasible_ratio(generation, generations, infeasible_ratio)
  
  for index, infeasible in enumerate(infeasibilities):
    if infeasible and random.random() < repair_prob:
      population[index] = improve_infeasible(instance, population[index])
      excess_demands[index] = 0
      infeasibilities[index] = False

  return population, infeasibilities, excess_demands