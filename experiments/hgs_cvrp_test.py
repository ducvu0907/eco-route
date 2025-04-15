# pseudo code
# 
# Initialize population with random solutions improved by local search
# while number of iterations without improvement < max_iter and time < max_time do
#   select parent solutions P1 and P2
#   apply the crossover operator on P1 and P2 to generate an offspring C
#   educate offspring C by local search
#   insert C into respective subpopulation
#   if C is infeasible then
#     with 50% prob, repair C and insert it into respective subpopulation
#   if maximum subpopulation size reached then
#     select survivors
#   adjust penalty coefficients for infeasibility
# return the best feasible solution

# open-source implementation includes 6 main class:
# Individual: individual solution of the GA
# Population: holds 2 subpopulations
# Genetic: main structure of the GA
# Split: contains the linear split algorithm
# LocalSearch: provides all the functions for local search including swap*
# CircleSector: contains elementary routines

# the method is driven by only 6 parameters: 
# population size
# generation size
# number of elite solutions considered in the fitness calculation
# number of close solutions considered in the diversity-contribution measure
# granular search parameter
# target proportion of feasible individuals for penalty adaptation