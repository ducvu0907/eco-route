import random

def swap_depots(instance, individual):
  customer1 = random.randint(0, instance.N - 1)
  customer2 = random.randint(0, instance.N - 1)
  # Ensure customers are different and assigned to different depots
  while customer1 == customer2 or individual[customer1] == individual[customer2]:
    customer2 = random.randint(0, instance.N - 1)
  
  new_individual = individual.copy()
  new_individual[customer1], new_individual[customer2] = individual[customer2], individual[customer1]
  return new_individual

def flip_depot(instance, individual):
  new_individual = individual.copy()
  index = random.randint(0, instance.N - 1)
  current_depot = new_individual[index]
  possible_depots = [d for d in range(instance.D) if d != current_depot]
  new_individual[index] = random.choice(possible_depots)
  return new_individual

def mutations(instance, population, sorted_indices):
  new_population = []
  for _ in range(10):
    index = random.choice(sorted_indices[:10])
    individual = population[index].copy()
    num_mutations = int(0.05 * instance.N)
    for _ in range(num_mutations):
      if random.random() < 0.5:
        new_individual = swap_depots(instance, individual)
      else:
        new_individual = flip_depot(instance, individual)
      new_population.append(new_individual)
  return new_population

def targeted_mutation(instance, population, sorted_indices, elite_parents):
  pop_length = len(population)
  new_population = []
  num_to_mutate = int(pop_length * 0.05) + (1 if (pop_length * 0.05) % 1 > 0 else 0)  # ceiling

  for _ in range(num_to_mutate):
    elite_parent = random.choice(elite_parents[:3])
    chosen_indices = random.sample(range(pop_length), 2)
    selected_index = sorted_indices[min(chosen_indices)]
    individual = population[selected_index].copy()

    num_customers = int(0.1 * instance.N)
    customers = random.sample(range(instance.N), num_customers)

    for c in customers:
      individual[c] = elite_parent[c]

    new_population.append(individual)
  return new_population
