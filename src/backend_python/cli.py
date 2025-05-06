import argparse
import subprocess
import os
from solver import solve_with_binary, solve_with_hygese, solve_with_pyvrp

if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("--instance-path", required=True, help="Path to the instance to solve")
  parser.add_argument("--time-limit", type=int, default=3, help="CPU time limit")
  parser.add_argument("--seed", type=int, default=0, help="Random seed")
  parser.add_argument("--verbose", type=int, default=1, help="Show verbose output")
  parser.add_argument("--solver", choices=["binary", "hygese", "pyvrp"], default="binary", help="Solver to use (binary, hygese or pyvrp)")
  args = parser.parse_args()

  instance_path, time_limit, seed, verbose, solver_choice = args.instance_path, args.time_limit, args.seed, args.verbose, args.solver

  if solver_choice == "binary":
    solve_with_binary(instance_path, time_limit, seed, verbose)
  elif solver_choice == "hygese":
    solve_with_hygese(instance_path, time_limit, seed, verbose)
  else:
    solve_with_pyvrp(instance_path, time_limit, seed, verbose)
