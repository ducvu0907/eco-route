import argparse
import itertools

n = 4
distances = [
  [0, 22, 26, 30],
  [30, 0, 45, 35],
  [25, 45, 0, 60],
  [30, 35, 40, 0]
]

# brute forcing
def brute_force():
  min_distance = float("inf")
  best_route = None
  cities = list(range(1, n))

  for perm in itertools.permutations(cities):
    route = [0] + list(perm) + [0]
    dist = 0
    for i in range(len(route) - 1):
      dist += distances[route[i]][route[i + 1]]

    if dist < min_distance:
      best_route = route
      min_distance = dist

  return (best_route, min_distance)

completed_visit = (1 << n) - 1
dp = [[-1 for _ in range(n)] for _ in range(1 << n)]

# dynamic programming with bitmask
def dp_with_bitmasking(mask, pos):
  if dp[mask][pos] != -1:
    return dp[mask][pos]

  if mask == completed_visit:
    return [pos, 0], distances[pos][0]

  ans = float('inf')
  best_route = []

  for city in range(n):
    if mask & (1 << city) == 0: # not visited
      new_mask = mask | (1 << city)
      route, new_cost = dp_with_bitmasking(new_mask, city)
      new_cost += distances[pos][city] 

      if new_cost < ans:
        ans = new_cost
        best_route = [pos] + route

  dp[mask][pos] = best_route, ans
  return best_route, ans

if __name__ == "__main__":
  # parser = argparse.ArgumentParser()
  # parser.add_argument("--method", choices=["brute_force", "dp"], required=True, help="Choose the method to solve TSP")
  # args = parser.parse_args()

  # if args.method == "brute_force":
  #   route, cost = brute_force()
  #   print(f"Brute Force Solution: {route} with cost {cost}")
  # elif args.method == "dp":
  #   route, cost = dp_with_bitmasking(1, 0)
  #   print(f"DP with bitmasking solution: {route} with cost {cost}")

  bf_result = brute_force()
  dp_result = dp_with_bitmasking(1, 0)

  print(f"Brute force solution: {bf_result[0]} with cost {bf_result[1]}")
  print(f"DP with bitmasking solution: {dp_result[0]} with cost {dp_result[1]}")