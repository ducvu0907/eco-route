def bellman_split(tour, demand, distance_matrix, capacity):
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


def linear_split(tour, demand, distance, capacity):
  from collections import deque
  n = len(tour)
  dp = [float('inf')] * (n + 1)
  pred = [-1] * (n + 1)
  dp[0] = 0

  # Cumulative demand and cost
  cum_demand = [0] * (n + 1)
  cum_cost = [0] * (n + 1)
  
  for i in range(1, n + 1):
    cum_demand[i] = cum_demand[i-1] + demand[tour[i-1]]
    cum_cost[i] = cum_cost[i-1] + distance[tour[i-2]][tour[i-1]] if i > 1 else distance[0][tour[0]]

  Q = deque()
  Q.append(0)

  for j in range(1, n + 1):
    # Remove infeasible split points
    while Q and cum_demand[j] - cum_demand[Q[0]] > capacity:
      Q.popleft()

    i = Q[0]
    # Efficient cost(i, j)
    cost = dp[i] + distance[0][tour[i]] + cum_cost[j] - cum_cost[i+1] + distance[tour[j-1]][0]
    dp[j] = cost
    pred[j] = i

    # Maintain deque (dominance check omitted for brevity)
    Q.append(j)

  routes = []
  end = n
  while end > 0:
    start = pred[end]
    routes.insert(0, tour[start:end])
    end = start

  return dp[n], routes


def bellman_split_lf(tour, demands, distances, capacity, fleet_size):
  """
  dp[k][i] = minimum cost to visit first i clients using k vehicles
  pred[k][i] = start of the route with minimum cost
  """
  num_clients = len(tour)
  num_vehicles = fleet_size

  # dp[k][i] = minimum cost to visit first i customer using k vehicles
  dp = [[float("inf")] * (num_clients + 1) for _ in range(num_vehicles + 1)]
  dp[0][0] = 0
  pred = [[-1] * (num_clients + 1) for _ in range(num_vehicles + 1)]

  for k in range(1, num_vehicles + 1):
    for i in range(k - 1, num_clients):
      load = 0
      dist = 0
      # we find if i can be good split of any j in (i+1 to num_clients)
      for j in range(i + 1, num_clients + 1):
        load += demands[tour[j - 1]]
        if load > capacity:
          break

        if j == i + 1: 
          # entry to the new route
          dist = distances[0][tour[j - 1]]
        else: 
          # accumulate distance
          dist += distances[tour[j - 2]][tour[j - 1]]

        cost = dist + distances[tour[j - 1]][0] # there are additional penalties in the robust impl

        if dp[k - 1][i] + cost < dp[k][j]:
          dp[k][j] = dp[k - 1][i] + cost
          pred[k][j] = i

  if dp[num_vehicles][num_clients] == float("inf"):
    print("No split solution found")

  min_cost = dp[-1][-1]
  num_routes = num_vehicles
  for k in range(1, num_vehicles):
    if dp[k][-1] < min_cost:
      min_cost = dp[k][-1]
      num_routes = k
  
  # trace
  routes = []
  end = num_clients
  while num_routes:
    start = pred[num_routes][end]
    routes.insert(0, tour[start:end])
    num_routes -= 1
    end = start
  
  return routes, min_cost


# towards a very simple algorithm
# define cumulative distance Di and cumulative load Qi
# then the cost can be accessed with c(i,j) = d[0][i+1] + D[j] - D[i+1] + d[j][0]
# and the arc only exists if and only if Q[j] - Q[i] <= capacity
# we also rely on double-ended queue A, which supports the following operations in O(1)
# front, front2, back, push_back, pop_front, pop_back
# proposed algorithm pseudo:
#
# p[0] = 0
# A <- (0)
# traverse number of clients
# for t = 1 to n do
  # p[t] = p[front] + f(front,t)
  # pred[t] = front
  # if t < n then
    # if not dominates(back,t) then
      # while len(queue) > 0 and dominates(t,back) do
        # pop_back()
      # push_back(t)
    # while Q[t+1] > Q + Q[front] do
      # pop_front()
# dominates(i,j) = p[i] + d[0][i+1] - D[i+1] <= p[j] + d[0][j+1] - D[j+1]
# f(i,x) = p[i] + c(i,x) - cost when extending the label of a predecessor i to a node x
def linear_split_lf(tour, demands, distances, capacity, fleet_size):
  from collections import deque
  num_clients = len(tour)
  num_vehicles = fleet_size

  dp = [[float("inf")] * (num_clients + 1) for _ in range(num_vehicles + 1)]
  dp[0][0] = 0

  pred = [[-1] * (num_clients + 1) for _ in range(num_vehicles + 1)]
  queue = deque([0])

  # core split algorithm
  for k in range(1, num_vehicles + 1):
    for j in range(k, num_clients + 1):
      pass


  # record solution
  min_cost = dp[-1][-1]
  num_routes = num_vehicles
  for k in range(1, num_vehicles):
    if dp[k][-1] < min_cost:
      min_cost = dp[k][-1]
      num_routes = k
  
  # trace
  routes = []
  end = num_clients
  while num_routes:
    start = pred[num_routes][end]
    routes.insert(0, tour[start:end])
    num_routes -= 1
    end = start
  
  return routes, min_cost


if __name__ == "__main__":
  tour = [1, 2, 3, 4, 5, 6, 7, 8]
  demands = [0, 4, 3, 7, 2, 5, 4, 6, 3]
  capacity = 15
  distances = [
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
  fleet_size = 3

  # routes, min_cost = bellman_split_lf(tour, demands, distances, capacity, fleet_size)
  routes, min_cost = linear_split_lf(tour, demands, distances, capacity, fleet_size)
  print(routes)
  print(min_cost)
