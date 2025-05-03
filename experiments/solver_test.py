import argparse
import subprocess
import os

def solve(instance_path, time_limit=3, seed=0, verbose=1):
  exec_path = os.path.join("bin", "hgs")
  assert os.path.isfile(exec_path), f"HGS executable '{exec_path}' not found"

  hgs_cmd = [
    exec_path,
    instance_path,
    "solution.sol",
    "-t", str(time_limit),
    "-seed", str(seed),
    "-log", str(verbose)
  ]

  print(hgs_cmd)
  try:
    result = subprocess.run(hgs_cmd, capture_output=True, text=True, check=True)
    print(result.stdout)
  except subprocess.CalledProcessError as e:
    print(f"Solver failed with return code {e.returncode}")
    print(e.stderr)

if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("--instance-path", required=True, help="Path to the instance to solve")
  parser.add_argument("--time-limit", type=int, default=3, help="CPU time limit")
  parser.add_argument("--seed", type=int, default=0, help="Random seed")
  parser.add_argument("--verbose", type=int, default=1, help="Show verbose output")
  args = parser.parse_args()

  solve(instance_path=args.instance_path, time_limit=args.time_limit, seed=args.seed, verbose=args.verbose)
