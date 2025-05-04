import os
import logging
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

load_dotenv()


# logger
FORMAT = "%(levelprefix)s  %(asctime)s  %(message)s"
logger = logging.getLogger("vrp_logger")
logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

formatter = uvicorn.logging.DefaultFormatter(FORMAT, datefmt="%Y-%m-%d %H:%M:%S")
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)


# models
class Location(BaseModel):
  lat: float
  lon: float


class Job(BaseModel):
  id: str
  location: Location
  demand: float


class Vehicle(BaseModel):
  id: str
  start: Location
  end: Location
  capacity: float


class Route(BaseModel):
  vehicle_id: str
  steps: List[Job]


class RoutingRequest(BaseModel):
  vehicles: List[Vehicle]
  routes: List[Route] = []
  jobs: List[Job]


class RoutingResponse(BaseModel):
  routes: List[Route]
  total_distance: float


# app
app = FastAPI()
cors_origins_raw = os.getenv("CORS_ORIGINS", "")
origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


# api routes
@app.post("/api/vrp", response_model=RoutingResponse)
def solve_vrp(request: RoutingRequest):
  """
  API endpoint to solve Vehicle Routing Problem (VRP).
  Delegates the computation to the solver module.
  """
  from solver import solve_api

  logger.info(f"Incoming VRP request: {request}")

  try:
    solution = solve_api(request)
    logger.info(f"Solver returned solution with total distance: {solution.total_distance}")
    return solution
  except Exception as e:
    logger.error(f"Solver failed: {str(e)}")
    raise HTTPException(status_code=500, detail=f"Error while solving instance: {e}")
