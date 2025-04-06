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
