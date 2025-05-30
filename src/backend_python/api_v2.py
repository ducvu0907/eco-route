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

# obtained from ors
class Geometry(BaseModel):
  type: str
  coordinates: List[List[float]] # lon,lat 

class Depot(BaseModel):
  id: str
  location: List[float]

class Vehicle(BaseModel):
  id: str
  depot_id: str
  location: List[float]
  capacity: float
  profile: Literal["driving-car", "driving-hgv"]

class Job(BaseModel):
  id: str
  location: List[float]
  demand: float

class Route(BaseModel):
  vehicle_id: str
  steps: List[Job]
  distance: Optional[float]
  duration: Optional[float]
  geometry: Optional[Geometry]

class RoutingRequest(BaseModel):
  depots: List[Depot]
  vehicles: List[Vehicle]
  routes: Optional[List[Route]] # present if dynamic request
  jobs: List[Job]

class RoutingResponse(BaseModel):
  routes: List[Route]
  unassigned: List[Job]

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
  from solver import solve
  logger.info(f"Incoming VRP request: {request}")
  solution = solve(request)
  logger.info(f"Solver returned solution: {solution}")
  return solution