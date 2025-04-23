def bellman_split(tour, demand, distance_matrix, capacity):
  """
  tour: List of customer indices (e.g., [1, 2, 3, 4])
  demand: List of demands, where demand[i] is the demand of customer i (0-indexed)
  distance_matrix: 2D list or array where distance_matrix[i][j] is the distance from i to j
  capacity: Maximum vehicle capacity
  """

  n = len(tour) # this length already exclude the depot
  INF = float("inf")
  dp = [INF] * (n + 1)
  predecessor = [-1] * (n + 1)
  dp[0] = 0

  for j in range(1, n + 1):
    load = 0
    for i in range(j - 1, -1, -1):
      load += demand[tour[i]]
      if load > capacity:
        break

      # calculate cost of route from tour[i] to tour[j - 1]
      # cost(i, j)
      route_cost = (
        distance_matrix[0][tour[i]]  # depot to first customer
        + sum(distance_matrix[tour[k]][tour[k+1]] for k in range(i, j - 1)) 
        + distance_matrix[tour[j - 1]][0]  # last customer to depot
      )

      if dp[i] + route_cost < dp[j]:
        dp[j] = dp[i] + route_cost
        predecessor[j] = i

  # print(predecessor)
  # tracing the solution
  routes = []
  end = n
  while end > 0:
    start = predecessor[end]
    routes.insert(0, tour[start:end])
    end = start

  return dp[n], routes


def linear_split(tour, demand, distance_matrix, capacity):
  pass

if __name__ == "__main__":
  tour = [1, 2, 3, 4, 5, 6, 7, 8]
  demand = [0, 4, 3, 7, 2, 5, 4, 6, 3]
  capacity = 15
  distance_matrix = [
    [0, 2, 3, 4, 5, 6, 7, 8, 9],
    [2, 0, 2, 3, 4, 5, 6, 7, 8],
    [3, 2, 0, 2, 3, 4, 5, 6, 7],
    [4, 3, 2, 0, 2, 3, 4, 5, 6],
    [5, 4, 3, 2, 0, 2, 3, 4, 5],
    [6, 5, 4, 3, 2, 0, 2, 3, 4],
    [7, 6, 5, 4, 3, 2, 0, 2, 3],
    [8, 7, 6, 5, 4, 3, 2, 0, 2],
    [9, 8, 7, 6, 5, 4, 3, 2, 0],
  ]

  total_cost, routes = bellman_split(tour, demand, distance_matrix, capacity)
  print("Total cost:", total_cost)
  print("Routes:", routes)
