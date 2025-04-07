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