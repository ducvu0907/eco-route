# Techinical Note: Split algorithm in O(n) for the capacitated vehicle routing problem

## Introduction

Efficient GAs with a complete solution representation and more advanced crossover operators now exist for the CVRP, a sign that the Split algorithm is useful but not a necessity. The representation as a giant tour enables to significantly reduce the number of distinct individuals in the GA, and many side constraints. 

The computational efficiency of the Split algorithm for the CVRP is the subject of this article. Here we consider an input solution is given, represented as a giant tour (1,...,n). Let d_i_i+1 be the distance between 2 successive customers, and d_0_i and d_i_0 be the distances from and to the depot. All distances and demand quantities are assumed to be non-negative. The objective of Split is to partition the giant tour into m disjoint sequences of consecutive visits. Each such sequence is associated to a route, which originates from the depot, visits its respective customers, and returns to the depot. The total distance of all routes should be minimized.

Classically, the Split algorithm is reduced to a shortest path problem between the nodes 0 and n of an acyclic graph. However, Split can become a computational bottleneck for large problems with many deliveries per route, when used iteratively in a metaheuristic.

To meet this challenge, we will introduce a new Split algorithm in O(n):
c(i1, j1) + c(i2, j2) <= c(i1, j2) + c(i2, j1) where c(i, j) is the cost of an arc (i, j).

## Bellman-based Split Algorithm 

Split is traditionally based on a simple dynamic programming algorithm, which enumerates nodes in topological order and, for each node t, propagates its label to all successors i. The arc costs are not preprocessed but directly computed in the inner loop.

```python
def bellman_split(tour, demand, distance_matrix, capacity):
  """
  tour: List of customer indices (e.g., [1, 2, 3, 4])
  demand: List of demands, where demand[i] is the demand of customer i (0-indexed)
  distance_matrix: 2D list or array where distance_matrix[i][j] is the distance from i to j
  capacity: Maximum vehicle capacity
  """

  n = len(tour)
  INF = float("inf")
  dp = [INF] * (n + 1)
  predecessor = [-1] * (n + 1)
  dp[0] = 0

  for j in range(1, n + 1):
    load = 0
    cost = 0
    for i in range(j - 1, -1, -1):
      load += demand[tour[i]]
      if load > capacity:
        break
      route_cost = (
        distance_matrix[0][tour[i]] +  # depot to first customer
        sum(distance_matrix[tour[k]][tour[k+1]] for k in range(i, j - 1)) +
        distance_matrix[tour[j - 1]][0]  # last customer to depot
      )

      if dp[i] + route_cost < dp[j]:
        dp[j] = dp[i] + route_cost
        predecessor[j] = i

  routes = []
  end = n
  while end > 0:
    start = predecessor[end]
    routes.insert(0, tour[start:end])
    end = start

  return dp[n], routes

tour = [1, 2, 3, 4]  # customer indices
demand = [0, 2, 4, 3, 2]  # index 0 is depot, customers 1-4
capacity = 5
distance_matrix = [
  [0, 2, 4, 6, 8],
  [2, 0, 1, 3, 5],
  [4, 1, 0, 2, 4],
  [6, 3, 2, 0, 2],
  [8, 5, 4, 2, 0],
]

total_cost, routes = bellman_split(tour, demand, distance_matrix, capacity)
print("Total cost:", total_cost)
print("Routes:", routes)
```

## Split in linear time
