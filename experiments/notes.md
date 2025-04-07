# Vehicle Routing Problem Survey  
## Constructive Heuristics

Constructive heuristics constructs routing solutions from zero following some fixed empirical procedures.

The existing constructive heuristics can be divided into 4 frameworks: nearest neighbour, insert, saving, sweep.

### Nearest Neighbour Method

The simplest constructive algorithm.

The routes can be built either sequentially or parallelly.

In sequential route building, a route is extended by greedily adding the nearest feasible unrouted customer with the depot as the starting node. A new route is initialized from the depot when no customer can be added.

In parallel route building, the number of vehicles K is set beforehand and the K routes are extended in parallel. In each iteration, each route is extended with the closest unrouteed customer, which means K customers will be added. If customer cannot be added to the K routes, then a new route will be created following the sequential route-building strategy.

### Insert Method

Insert method initializes some empty routes and inserts the unrouted customers one by one into the routes. In each iteration, the insertion that has the minimum cost is performed.

There are 2 layers of minimization problem in each iteration: first, to find the minimal insertion cost for each unrouted customer and then find the unrouted customer with the cheapest minimal insertion cost.

The regret insert extends the greedy insert. In each iteration, instead of performing the current best insertion, regret insert chooses to insert the node with the largest regret. The regret is defined as the difference between the cost of inserting the node in the best position and the ith-best position, where i usually set to be a small number. The idea is that the insertion with large regret will lead to a high cost if it is not inserted in the best position. 

### Saving Method

Saving method starts with an initial solution, in which a different route serves each customer, and iteratively combines the short routes into longer routes with lower overall costs. The procedure can be performed in parallel or in sequence. 

In its parallel version, the method iteratively combines 2 routes with the endpoints i and j, which produces the maximum feasible distance saving. In the sequential version, each route is considered in turn. One route is iteratively extended by feasible saving operation until no such feasible merge can be used.

### Sweep Method

The algorithm first sets the depot as the origin and sorts the nodes according to the polar angle. In its basic version, the node is added to the route circularly. A new route will be created if the insertion is infeasible. Another approach is cluster-first, route-second. All the customers are clustered into several clusters according to the polar angle and a TSP is solved in each cluster.

Among others, sweep nearest and distance-based sweep nearest are 2 straightforward implementations of the basic sweep method. In each cluster, they select the next nearest customer instead of until reach the capacity. The difference is the former starts from the unassigned customer with the smallest polar angle while the latter starts from the farthest unassigned customer. Both algorithms outperform the basic sweep algorithm and the results are competitive with modern heuristics.

## Improvement Heuristics

Improvement heuristics explore the neighborhood of the incumbent solution to achieve an objective improvement. They can quickly converge to the local optimall and theus are efficient at solving large-sclae routing problems. There are two widely recognized classes of improvement heuristics: intra-route and inter-route. The former searches inside a single route, while the latter involves multiple routes.

### Intra-route Method

Most of them originated from the local search operators for TSP. For instance, among the simplest ones, one customer can be relocated to a differentt position in the same route, or two customers in one route can be exchanged. The k-opt heuristic, removes k edges from a route and recreate k other edges to connect the disjoint sequences.

- **_Relocate_**: selects one route from the solution and relocates one node to another position in the route. The time complexity of finding the best relocation solution is O(n^2).
- **_Exchange_**: selects one route and exchanges the positions of 2 nodes in the route. The time complexity of finding the best solution is O(n^2).
- **_k-opt_**: 2-opt first selects one route and then reconnects the ends of two edges in the route. In other words, it reverses a sequence of nodes within the route. The time complexity of finding the best reconnection is O(n^2).
- **_Or-exchange_**: selects a sequence of nodes with a preset length and relocates it to another position in the same route. The time complexity of finding the best exchange is O(n^2).
- **_GENI_**: selects one route and a subset of 3 vertices. For a vertex v not yet on the route, it implements the least cost insertion considering the 2 possible orientations of the route and the two insert types.

### Inter-route Method

Inter-route heuristics involve local searches across multiple routes. Many of them are extensions of intra-route counterparts. For example, insert and swap are the extension of relocate and exchange, respectively. The former removes a customer from one route and reinserts it into another route. The latter swaps 2 customers from different routes.

- **_2-opt*_**: selects 2 routes and reconnects the end of two edges. If the cost of the selection of two routes can be neglected, its time complexity is the same as 2-opt.
- **_Insert_**: selects one node and inserts it into another position, similar to _relocation_ operator.
- **_Swap_**: selects 2 nodes and swaps their location, similar to _exchange_ operator.
- **_CROSS_**: exchanges 2 customer sequences (one of the 2 sequences can be empty). It generalizes the three mentioned operators: _2-opt*_, _insert_, and _swap_.
- **_k-interchange_**: generalizes _CROSS_, allowing exchanging any set of less than k nodes between two routes. The set can be non-consecutive, empty, and reversed during the reinsert.

One approach is to use machine learning to improve algorithm performance. For example, using policy deep learning to learn a 2-opt improvement heuristic, leveraging graph neural network to predict the cost-decrements in _CROSS_ heuristic. Instead of learning to improve one improvement heuristic, using reinforcement learning to select dynamically from three different improvement heuristics and the results demonstrated how well it outperforms the conventional approach.

## Metaheuristic

Metaheuristics are presented in a more general and high-level way, in contrast to constructive heuristics and improvement heuristics, which are problem-dependent and attempt to exploit the feature and structure of the target problem. Due to their efficiency and scalability, metaheuristics are becoming increasingly dominating in vehicle routing research.

According to the population management strategy, we classify metaheuristics into two categories: _single-solution-based_ and _population-based_. Single-solution-based iteratively perform low-level searches on one incumbent solution. The low-level search is typically improvement heuristics. Except for the design or selection of low-level heuristics, the key will be how to guide the search process in a principled way to dump out of the local optimum and retain a certain level of exploration of the search space. It is achieved by tailored high-level rules. There are three approaches for designing the high-level rules: _multiple starts_, _changing the landscape_, _designing the acceptance rule_. In the first approach, the local search starts from multiple initial points. The strategies include seearching from multiple starts, changing start points during optimization, and combining both. In the second approach, local search is guided by changing the fitness landscape. They either modify the landscape during optimization or use different landscapes. In the last approach, a well-designed acceptance criterion is used to drive the search forward. They leave out some visited unpromising solutions or accept worse solutions with a certain probability.

Evolutionary algorithms and swarm intelligence are 2 essential approaches for doing population-based searches. Evolutionary algorithm, such as genetic algorithm, is inspired by biological evolution. Individuals who are stronger (more suited to the environment) than the competition are more likely to generate offsprings who can better survive.

In this section, we survey the widely-used metaheuristics in vehicle routing, including simulated annealing (SA), tabu search (TS), iterated local search (ILS), large neighborhood search (LNS), genetic algorithm (GA), ant colony optimization (ACO), memetic algorithm (MA).

### Single-Solution-Based Method

#### Simulated Annealing

The idea is similar to the actual annealing of materials in physics. In the SA algorithm, a mechanism is used to mutate the incumbent solution to generate a new solution in the design space. The mechanism is commonly one or multiple local search operators. The solution itself and the fitness of the solution correspond to the state and the energy in the annealing process, respectively. A typical strategy used in SA to accept a new solution is as follows: a new solution is accepted if its fitness is better than the old one, a new solution is worse than the old one, it is accepted with a probability of *exp((f(s_new) - f(s_old)) / T)*, where the control parameter T represents the temperature. The process is iteratively performed with a decreasing temperature. The key of SA is on the acceptance criterion, it escapes the local optimal by accepting the slightly worse solution and converges to the optimal solution with the decreasing temperature.

#### Tabu Search

An important concept is the tabu lists, which keep track of the most recent history of the search and prevent the search from going back to previously visited solutions.

Several improvements to the basic tabu search framework have been applied to solving vehicle routing problems. For example, some works used adaptive memory programming in tabu search. THe adaptive memory programming exploits a collection of strategic memory components and is more efficient than using a single fixed memory management procedure.

The granular is a restricted neighborhood, which not containing the moves that have a low probability of leading to a good feasible solution. For vehicle routing, the granular is typically defined as a limited number of "short" arcs, based on the observation that "long" arcs are less possible to be part of high quality solution.

As a general concept, tabu search can be easily integrated into other algorithms.

#### Iterated Local Search

ILS builds on the simple idea that iteratively generates a sequence of solutions using the underlying heuristics. Different from SA and TS, ILS uses perturbation to jump out of local optimal instead of changing fitness or acceptance criterion. The perturbation can be as simple as a random restart or more commonly a principled strategy, such as various neighborhood search heuristics.


#### Large Neighborhood Search

Large neighborhood search, is developed based on the idea that a large neighborhood has a large probability containing high-quality local optimum. Although any neighborhood can be adopted in the LNS paradigm, for vehicle routing, it typically consists of 2 main procedures: ruin and recreate. *Ruin* removes a part of the incumbent solution and *recreate* reinserts the removed part into the partial solution to form a new solution. 

The ruin method typically takes into consideration the relatedness of removed customers. The relatedness is usually measured by distance and other similarities. The insert procedure usually uses constructive heuristics, such as insert methods.

Adaptive Large Neighborhood Search (ALNS) is a well-known extension of LNS. ALNS consists of multiple ruin and recreate operators and adaptively selects these operators in each iteration. The probability of choosing each operator is determined using the historical performance during the optimization.
 
 ### Population-Based Method

 #### Genetic Algorithm

 Genetic algorithm has been a popular method in the optimization community for many years. It builds on the idea that natural evolution drives the evolution of all species and maintains a good balance of population diversity and adaptiveness. The 2 key evolutionary operations are crossover and mutation. The mutation involves permutation on one solution to generate new offspring. In a broader sense, any permutation operators can be regarded as a kind of mutation. The crossover is an inter-solution exchange, which typically generates offsprings from 2 selected parents. Most of the crossover operators used in vehicle routing inherit from the ones used in genetic algorithm for TSP. Some frequently used operators in vehicle routing are: order crossover, partially mapped crossover, edge recombination crossover, cycle crossover and alternating edges crossover.

 The research of using GA for solving vehicle routing took off twenty years ago. Along with the application study of GA on different modern VRP variant.

 #### Ant Colony Optimization

 Ant colony optimization is motivated by the behaviour of real ants. They communicated with each other using pheromones, which are updateed during the search procedure. Similar to the strategy used by the ant colony, ACO constructs solutions to the problem at hand based on the pheromones, which they then adjusted during the optimization to take into account their search history.

 #### Memetic Algorithm

The memetic algorithm has shown promise in a number of application areas, particularly efficient for hard optimization problems including vehicle routing problems. Unlike other classical population-based methods, MA takes the advantages of different searching approaches. It is stimulated by the process of cultural evolution, where information is not simply exchanged between individuals but also processed and enhanced during communication. This enhancement is commonly achieved by incorporating efficient search methods, such as local search techniques.

The implementations of MA on vehicle routing typically combine population-based heuristics with improvement heuristics. The cooperation of different search approaches usually results in an efficient algorithm. Actually, many cutting-edge vehicle routing algorithms are the implementations of MA or use the concept of MA.

Among them, hybrid genetic search (HGS), which combines genetic search and local search operators and utilizes a diversity control on the population, is a representative one. It is regarded as the most competitive vehicle routing heuristic with its recent revisions and enhancements.

## Insights into SOTA Heuristics

The triumph of the cutting-edge methods benefits from a combination of several heuristic concepts rather than the implementation of a single specific metaheuristic algorithm. Despite there are various kinds of implementation, they all adhere to a general algorithm framework. Besides solution initialization, there are three key components: solution perturbation, improvement, and selection; just as their name suggest, the first one is to diversify the solution candidates, while the second is to intensify them, and the last one is to decide whether to store some new solutions or to discard some old ones.

1. Collaboration: The vast majority of these methods are not simply a specific instance of some certain metaheuristic, but rather a fusion of multiple different concepts. On the other hand, effective intensification procedures, typically improvement heuristics, are combined with diversification procedures, like crossover, shaking, and restart. The algorithm may utilize multiple metaheuristic concepts to tailor the search landscape.

2. Initialization: It is generally believed that a wise initialization eases the burden of the subsequent optimization process, which eventually benefits global convergence. The majority of SOTA methods achieve this by employing one or multiple constructive heuristics in the solution initialization phase. Some exceptions use simpler ways for initialization with corresponding refinement procedures. 
 
3. Solution Perturbation and Improvement: Most SOTA methods combine a variety of intra-route and inter-route improvement heuristics in the solution improvement phase. Compared with the improvement, the choices for perturbation are more diverse. Crossover, shaking, restart, among others, are typical examples. 

4. Solution Selection: A proper management of solutions is vital for the long-term performance of routing heuristics. A wise solution management scheme should always avoid being short-sighted or too greedy. For the single-solution-based method, it is reflected in the designing of acceptance criteria for a new solution. Rather than accepting the new solution in a greedy way, a better strategy is to allow accepting a worse solution under a certain probability or threshold. For the population-based method, an adaptive replacement strategy is required to select the offspring generation to balance the divergence and convergence. 

5. Two-phase Paradigms: Many successful population-based heuristics for routing problems use giant tour in the representation of solution. The paradigm behind this is first to generate a giant tour and then segment it into several feasible routes. The segmentation of the giant tour can be reduced to the shortest path problem on an acyclic graph, which can be solved exactly and efficiently. This two-phase paradigm is usually referred to as the "routing first clustering second" approach. Correspondingly, "clustering first routing second" is another two-phase approach, which is now commonly used in solving large-scale VRPs. It separates customers into several clusters, then constructs a route for each cluster. The routing for each cluster can be served as a TSP variant and solved efficiently using heuristics.