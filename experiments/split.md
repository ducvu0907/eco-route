# Techinical Note: Split algorithm in O(n) for the capacitated vehicle routing problem

## Introduction

Efficient GAs with a complete solution representation and more advanced crossover operators now exist for the CVRP, a sign that the Split algorithm is useful but not a necessity. The representation as a giant tour enables to significantly reduce the number of distinct individuals in the GA, and many side constraints. 

The computational efficiency of the Split algorithm for the CVRP is the subject of this article. Here we consider an input solution is given, represented as a giant tour (1,...,n). Let d_i_i+1 be the distance between 2 successive customers, and d_0_i and d_i_0 be the distances from and to the depot. All distances and demand quantities are assumed to be non-negative. The objective of Split is to partition the giant tour into m disjoint sequences of consecutive visits. Each such sequence is associated to a route, which originates from the depot, visits its respective customers, and returns to the depot. The total distance of all routes should be minimized.

Classically, the Split algorithm is reduced to a shortest path problem between the nodes 0 and n of an acyclic graph. However, Split can become a computational bottleneck for large problems with many deliveries per route, when used iteratively in a metaheuristic.

To meet this challenge, we will introduce a new Split algorithm in O(n):
c(i1, j1) + c(i2, j2) <= c(i1, j2) + c(i2, j1) where c(i, j) is the cost of an arc (i, j).

## Bellman-based Split Algorithm 

Split is traditionally based on a simple dynamic programming algorithm, which enumerates nodes in topological order and, for each node t, propagates its label to all successors i. The arc costs are not preprocessed but directly computed in the inner loop.

## Split in linear time

This section will introduce a more efficient Split algorithm. As in the classical Split, the arc costs of the underlying graph are not preprocessed.

We define for i in {1,...n} the cumulative distance D[i] and cumulative load Q[i]
These values can be preprocessed and stored in O(n) at the beginning of the algorithm. For i < j, the cost c(i,j) is the cost of leaving the depot, visiting customers(i+1,...j) and returning to the depot, computed as:
c(i,j) = d[0][i+1] + D[j] - D[i+1] + d[j][0]
and the arc (i,j) exists only if the route is feasible - Q[j] - Q[i] < Q

Our algorithm also relies on a double-ended queue, supports the following operations in O(1):
front - accesses the oldest element in the queue
front2 - accesses the second oldest element in the queue
back - accesses the most recent element in the queue
push_back - adds an element to the queue
pop_front - removes the oldest element in the queue
pop_back - removes the newest element in the queue

**Main algorithm**: instead of iterating over all arcs to propagate minimum-cost paths, the proposed algorithm takes advantage of the cost structure of the split graph and maintains a set of nondominated predecessors in a queue. For each node, this structure enables to find in O(1) a best predecessor for t along with the cost of a shortest path from 0 to t.

