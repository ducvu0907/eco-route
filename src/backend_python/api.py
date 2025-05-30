import os
import logging
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
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
class Geometry(BaseModel): # this is in lon/lat since returned by ors api 
  type: str
  coordinates: List[List[float]]

class Location(BaseModel):
  lat: float
  lon: float


class Job(BaseModel):
  id: str
  location: Location
  demand: float


class Vehicle(BaseModel):
  id: str
  start: Location # current position of the vehicle, should be the same as end in static and different in dynamic
  end: Location
  load: float = 0 # current load of the vehicle, could be positive if dynamic request
  capacity: float
  profile: Literal["driving-car", "driving-hgv"]


class Route(BaseModel):
  vehicle_id: str
  steps: List[Job]
  distance: Optional[float] = 0.0
  duration: Optional[float] = 0.0
  geometry: Optional[Geometry] = None


class RoutingRequest(BaseModel):
  vehicles: List[Vehicle]
  routes: List[Route] = [] # this should only contain unfinished steps in the dynamic request
  jobs: List[Job]
  profile: Literal["driving-car", "driving-hgv"]


class RoutingResponse(BaseModel):
  routes: List[Route] # should only contain updated routes when respond to dynamic request


# app
app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"],
)


# api routes
@app.exception_handler(RequestValidationError)
async def handle_exception(request: Request, e: Exception):
  return JSONResponse(
    status_code=400,
    content={"error": f"Invalid request format {e}"},
  )

@app.exception_handler(Exception)
async def handle_exception(request: Request, e: Exception):
  return JSONResponse(
    status_code=500,
    content={"error": f"Error while solving problem: {e}"},
  )

@app.post("/api/vrp", response_model=RoutingResponse)
def solve_vrp(request: RoutingRequest):
  """
  API endpoint to solve Vehicle Routing Problem (VRP).
  Delegates the computation to the solver module.
  """
  from solver import solve_request

  logger.info(f"Incoming VRP request: {request}")
  solution = solve_request(request)
  logger.info(f"Solver returned solution: {solution}")
  return solution
