import time
import copy
import numpy as np
from .population import generate_population, generate_subpopulation, generate_subpopulation_refined, generate_population_refined
from .evaluate import batch_fitness_cost, diversity, fitness_scores, hgs_solutions, hgs_cvrp, fitness_scores_refined
from .utils import are_infeasibles, repair_infeasibles, delete_duplicates, repair_infeasibles_refined
from .mutations import targeted_mutation, mutations, targeted_mutation_refined, mutations_refined
from .read_mdvrp import read_mdvrp_cordeau
from .local_search import local_search


def mdvrp_solve(instance, 
                weights=[0.9, 0.9], 
                pop_limit=[30, 40], 
                generations=5, 
                hgs_time_limit=1.0, 
                prob_repair=0.8,
                dist_type="euclidean",
                top_k=5):
  
  # start a timer
  # generate initial candidates pool of 10 solutions
  start_time = time.monotonic()
  population = generate_population(instance, 10)

  # infeasibility check and repair
  infeasibilities, excess_demands = are_infeasibles(instance, population)
  population, infeasibilities, excess_demands = repair_infeasibles(
    instance, population, infeasibilities, excess_demands, prob_repair
  )

  # evaluate fitness scores
  costs = batch_fitness_cost(instance, population)
  diversities = diversity(population)
  scores = fitness_scores(costs, diversities, weights[0], weights[1], excess_demands)

  # select initial elites
  sorted_indices_pop = np.argsort(costs)
  top_solutions = [population[i] for i in sorted_indices_pop[:2]]
  top_costs = [costs[i] for i in sorted_indices_pop[:2]]
  # elite_parents = copy.deepcopy([population[i] for i in sorted_indices_pop[:3]])
  elite_parents = [population[i] for i in sorted_indices_pop[:3]]

  # main evolution loop
  generation = 0
  while generation < generations and time.monotonic() - start_time < 10.0:
    # create subpopulation
    # infeasibility check and repair
    subpopulation = generate_subpopulation(instance, population, scores, pop_limit[0])
    infeasibilities, excess_demands = are_infeasibles(instance, subpopulation)
    subpopulation, infeasibilities, excess_demands = repair_infeasibles(
      instance, subpopulation, infeasibilities, excess_demands, prob_repair
    )

    # evalute fitness scores
    subcosts = batch_fitness_cost(instance, subpopulation)
    diversities = diversity(subpopulation)
    sub_scores = fitness_scores(subcosts, diversities, weights[0], weights[1], excess_demands)

    # apply 2 types of mutations
    # targeted mutations: guided by elites to improve promising area
    # random mutations: maintains exploration
    sorted_indices = np.argsort(sub_scores)
    new_population_targM = targeted_mutation(instance, subpopulation, sorted_indices, elite_parents)
    new_population_randM = mutations(instance, subpopulation, sorted_indices)
    new_population = new_population_targM + new_population_randM

    # evalute new offsprings
    new_costs = batch_fitness_cost(instance, new_population)
    new_infeas, new_excess_dem = are_infeasibles(instance, new_population)

    subpopulation += new_population
    subcosts = np.concatenate((subcosts, new_costs))
    infeasibilities = np.concatenate((infeasibilities, new_infeas))
    excess_demands = np.concatenate((excess_demands, new_excess_dem))

    sorted_indices = np.argsort(subcosts)
    top_solutions += [subpopulation[i] for i in sorted_indices[:2]]
    top_costs += [subcosts[i] for i in sorted_indices[:2]]

    # add best previous individuals to maintain elite genes
    if generation < generations - 1:
      print(len(population), max(sorted_indices_pop))
      sorted_indices_pop = np.argsort(costs)
      top_1_percent_count = max(1, int(0.01 * len(population)))
      subpopulation += [population[i] for i in sorted_indices_pop[:top_1_percent_count]]
      subcosts = np.concatenate((subcosts, [costs[i] for i in sorted_indices_pop[:top_1_percent_count]]))

      population, costs = delete_duplicates(subpopulation, subcosts)
      diversities = diversity(population)
      infeasibilities, excess_demands = are_infeasibles(instance, population)
      scores = fitness_scores(costs, diversities, weights[0], weights[1], excess_demands)
      sorted_scores_indices = np.argsort(scores)

      pop_size = min(len(population), pop_limit[1])
      population = [population[i] for i in sorted_scores_indices[:pop_size]]
      costs = [costs[i] for i in sorted_scores_indices[:pop_size]]

      scores = [scores[i] for i in sorted_scores_indices[:pop_size]]
      sorted_indices_pop = np.argsort(scores)

    # print(f"*** Generation {generation + 1} completed.")

  nn_time = time.monotonic() - start_time

  # final processing
  # use hgs to solve cvrp for each depot assignments 
  top_solutions, top_costs = delete_duplicates(top_solutions, top_costs)
  top_infeas, _ = are_infeasibles(instance, top_solutions)

  # filter out infeasible solutions
  top_solutions = [sol for sol, inf in zip(top_solutions, top_infeas) if not inf]
  top_costs = [cost for cost, inf in zip(top_costs, top_infeas) if not inf]

  sorted_topcost_indices = np.argsort(top_costs)
  best_count = min(top_k, len(top_costs))

  top_solutions = [top_solutions[i] for i in sorted_topcost_indices[:best_count]]
  nn_costs = [top_costs[i] for i in sorted_topcost_indices[:best_count]]

  hgs_costs, mdvrp_routes = hgs_solutions(instance, top_solutions, hgs_time_limit, dist_type)

  total_time = time.time() - start_time

  return nn_costs, nn_time, hgs_costs, total_time, mdvrp_routes


def mdvrp_solve_refined(instance, 
                weights=[0.9, 0.4], 
                pop_limit=[30, 40], 
                generations=5, 
                hgs_time_limit=1.0, 
                dist_type="euclidean",
                max_runtime=10.0,
                top_k=5):
  
  # start a timer
  # generate initial candidates pool of 10 solutions
  start_time = time.monotonic()
  population = generate_population_refined(instance, 20)
  population = local_search(instance, population)
  print("Population: ", population)

  # infeasibility check and repair
  infeasibilities, excess_demands = are_infeasibles(instance, population)
  print("Infeasibilities: ", infeasibilities)
  print("Excess demands: ", excess_demands)
  population, infeasibilities, excess_demands = repair_infeasibles_refined(
    instance, population, infeasibilities, excess_demands, 0, generations
  )

  # evaluate fitness scores
  costs = batch_fitness_cost(instance, population)
  diversities = diversity(population)
  scores = fitness_scores_refined(costs, diversities, weights[0], 0, generations, excess_demands)
  print("Costs: ", costs)
  print("Diveristies: ", diversities)
  print("Scores: ", scores)

  # select initial elites
  sorted_indices_pop = np.argsort(costs)
  print("Sorted indices pop: ", sorted_indices_pop)
  top_solutions = [population[i] for i in sorted_indices_pop[:2]]
  top_costs = [costs[i] for i in sorted_indices_pop[:2]]
  elite_parents = [population[i] for i in sorted_indices_pop[:3]]

  # main evolution loop
  generation = 0
  # while generation < generations:
  while generation < generations and time.monotonic() - start_time < max_runtime:
    # create subpopulation
    # infeasibility check and repair
    # subpopulation = generate_subpopulation_refined(instance, population, scores, pop_limit[0])
    subpopulation = generate_subpopulation(instance, population, scores, pop_limit[0])
    subpopulation = local_search(instance, subpopulation)
    infeasibilities, excess_demands = are_infeasibles(instance, subpopulation)
    subpopulation, infeasibilities, excess_demands = repair_infeasibles_refined(
      instance, subpopulation, infeasibilities, excess_demands, generation, generations
    )

    # evalute fitness scores
    subcosts = batch_fitness_cost(instance, subpopulation)
    diversities = diversity(subpopulation)
    sub_scores = fitness_scores_refined(subcosts, diversities, weights[0], generation, generations, excess_demands)

    # apply 2 types of mutations
    # targeted mutations: guided by elites to improve promising area
    # random mutations: maintains exploration
    sorted_indices = np.argsort(sub_scores)
    new_population_targM = targeted_mutation(instance, subpopulation, sorted_indices, elite_parents)
    new_population_randM = mutations(instance, subpopulation, sorted_indices)
    new_population = new_population_targM + new_population_randM
    new_population = local_search(instance, new_population)

    # evalute new offsprings
    new_costs = batch_fitness_cost(instance, new_population)
    new_infeas, new_excess_dem = are_infeasibles(instance, new_population)
    new_population, new_infeas, new_excess_dem = repair_infeasibles_refined(
      instance, new_population, new_infeas, new_excess_dem, generation, generations
    )

    subpopulation += new_population
    # subpopulation = local_search(instance, subpopulation)
    # infeasibilities, excess_demands = are_infeasibles(instance, subpopulation)
    # subpopulation, infeasibilities, excess_demands = repair_infeasibles_refined(
    #   instance, subpopulation, infeasibilities, excess_demands, generation, generations
    # )

    subcosts = np.concatenate((subcosts, new_costs))
    infeasibilities = np.concatenate((infeasibilities, new_infeas))
    excess_demands = np.concatenate((excess_demands, new_excess_dem))

    sorted_indices = np.argsort(subcosts)
    top_solutions += [subpopulation[i] for i in sorted_indices[:2]]
    top_costs += [subcosts[i] for i in sorted_indices[:2]]

    # add best previous individuals to maintain elite genes
    if generation < generations - 1:
      # print(len(population), max(sorted_indices_pop))
      sorted_indices_pop = np.argsort(costs)
      top_1_percent_count = max(1, int(0.01 * len(population)))
      subpopulation += [population[i] for i in sorted_indices_pop[:top_1_percent_count]]
      subcosts = np.concatenate((subcosts, [costs[i] for i in sorted_indices_pop[:top_1_percent_count]]))

      population, costs = delete_duplicates(subpopulation, subcosts)
      diversities = diversity(population)
      infeasibilities, excess_demands = are_infeasibles(instance, population)
      scores = fitness_scores_refined(costs, diversities, weights[0], generation, generations, excess_demands)
      sorted_scores_indices = np.argsort(scores)

      pop_size = min(len(population), pop_limit[1])
      population = [population[i] for i in sorted_scores_indices[:pop_size]]
      costs = [costs[i] for i in sorted_scores_indices[:pop_size]]

      scores = [scores[i] for i in sorted_scores_indices[:pop_size]]
      sorted_indices_pop = np.argsort(scores)

    print(f"*** Generation {generation + 1} completed.")
    generation += 1

  nn_time = time.monotonic() - start_time

  # final processing
  # use hgs to solve cvrp for each depot assignments 
  top_solutions, top_costs = delete_duplicates(top_solutions, top_costs)
  top_infeas, _ = are_infeasibles(instance, top_solutions)

  # filter out infeasible solutions
  top_solutions = [sol for sol, inf in zip(top_solutions, top_infeas) if not inf]
  top_costs = [cost for cost, inf in zip(top_costs, top_infeas) if not inf]

  sorted_topcost_indices = np.argsort(top_costs)
  best_count = min(top_k, len(top_costs))

  top_solutions = [top_solutions[i] for i in sorted_topcost_indices[:best_count]]
  nn_costs = [top_costs[i] for i in sorted_topcost_indices[:best_count]]

  hgs_costs, mdvrp_routes = hgs_solutions(instance, top_solutions, hgs_time_limit, dist_type)

  total_time = time.monotonic() - start_time

  return nn_costs, nn_time, hgs_costs, total_time, mdvrp_routes

# wrapper to choose the best solution among top-k
def solve_instance(instance, dist_type="euclidean"):
  if instance.num_depots == 1:
    costs, routes = hgs_cvrp(instance, dist_type=dist_type)
    return costs, routes
  # _, _, hgs_costs, _, mdvrp_routes = mdvrp_solve(instance, dist_type=dist_type)
  _, _, hgs_costs, _, mdvrp_routes = mdvrp_solve_refined(instance, dist_type=dist_type)
  best_cost = min(hgs_costs)
  best_idx = hgs_costs.index(best_cost)
  best_routes = mdvrp_routes[best_idx]
  return best_cost, best_routes


def benchmark_instance(instance, dist_type="euclidean"):
  if instance.num_depots == 1:
    costs, routes = hgs_cvrp(instance, dist_type=dist_type)
    return costs, routes
  _, _, hgs_costs, _, _ = mdvrp_solve(instance, dist_type=dist_type)
  _, _, hgs_costs_refined, _, _ = mdvrp_solve_refined(instance, dist_type=dist_type)
  best_cost = min(hgs_costs)
  best_cost_refined = min(hgs_costs_refined)
  return best_cost, best_cost_refined

# test benchmark instance
if __name__ == "__main__":
  instance = read_mdvrp_cordeau("/home/ducvu/work/projects/eco-route/src/backend_python/data/mdvrp/p01")