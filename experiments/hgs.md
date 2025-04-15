# Hybrid Genetic Search

## HGS for the CVRP

The modern HGS-CVRP performance comes from a combination of 3 main stages:
- A synergistic combination of crossover-based and neighborhood-based search 
- A controlled exploratoin of infeasible solution
- Advanced population diversity management strategies

After the population initialization phase, the algorithm iteratively generates new solutions by:
1. Selecting 2 parents
2. Recombining them to produce a new solution
3. Improving this solution with a local search
4. Inserting the result in the population

**Parents Selection**: to select each parent, the algorithm performs a binary tournament selection conssisting in randomly picking, with uniform probability, 2 individuals and retaining the one with the best fitness. The notion of fitness in HGS is based on objective value and diversity considerations. Each individual is characterized by its rank in terms of solution quality and its rank in terms of diversity contribution. Its fitness is then calculated as a weighted sum of those ranks with a slightly larger weight on solution quality.


**Recombination**: HGS applies an ordered crossover (OX) on a simple permutation-based representation of the 2 parents. OX consists in inheriting a random fragment of the first parent, and the completing missing visits using the sequence of second parent. This representation omits the visits to the depot, in such a way that capacity constraints are disregarded in the crossover. In HGS-CVRP, we rely on the efficient linear-time split algorithm after each crossover operation. 

**Neighborhood Search**: An efficient local search is applied to each solution resulting from the crossover and split algorithms. In the original algorithm (2012), this search included 2 stages: route improvement (RI) and pattern improvement (PI). The RI local search uses swap and relocate moves, generalized to sequences of 2 consecutive nodes, as well as 2-opt and 2-opt*. The neighborhoods are limited to moves involving geographically close node pairs (i,j) such that j belongs to the closest clients from i, therefore limits neighborhoods' size. The exploration of the moves is organized in random order of the indices i and j and any improving move is immediately applied. This process is pursued until attaining a local minimum. The PI phase was originally designed to optimize the assignment of client visits to days or depots, for VRP variants with multiple periods or depots. It is possible for a solution to remain infeasible after the local search. A repair operation is applied with 50% probability. This operations consists of running the local search with 10x higher penalty coefficients, aiming to recover a feasible solution.

**Population management**: HGS maintains 2 subpopulations: feasible and infeasible. Each individual produced in the previous steps is directly included in the corresponding subpopulation. Whenever a sub reaches maximum size, a survivors selection phase is triggered to iteratively eliminate solutions. The penalty param for solution infeasibility are adapted through the search to achieve a target ratio of feasible solutions at the end of LS. This is done by monitoring the number of feasible solutions obtained at regular intervals and increasing or decreasing the penalty coefficient by a small factor to achieve the desired target ratio.

**The swap* neighborhood**: The classical swap exchanges 2 customers in place. In contrast, the proposed swap* consists in exchanging 2 customers v and v' from different routes r and r' without an insertion in place. In this process, v can be inserted in any position of r', and v' can be inserted in any position of r. Evaluating all the swap* moves would take a computational time proportional to O(n^3) with a direct implementation and reduced to O(n^2) with optimization.
