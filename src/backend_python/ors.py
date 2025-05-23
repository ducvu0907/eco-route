import openrouteservice
from typing import List, Literal
from openrouteservice.directions import directions
from openrouteservice.distance_matrix import distance_matrix
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("ORS_API_KEY")

if not API_KEY:
  raise EnvironmentError("ORS_API_KEY not set in environment variables")

client = openrouteservice.Client(key=API_KEY)


def get_directions(points: List[List[float]], profile: Literal["driving-car", "driving-hgv"]):
  """
  Get route directions using ORS between a list of points.
  Points must be in format [[lat, lon], [lat, lon], ...].
  """
  coords = [(lon, lat) for lat, lon in points]  # ORS expects (lon, lat)

  try:
    route = directions(
      client,
      coordinates=coords,
      profile=profile,
      format='geojson',
      units='km',
      geometry=True,
      geometry_simplify=False
    )

    geometry = route['features'][0]['geometry']
    distance_km = route['features'][0]['properties']['summary']['distance']
    duration_min = route['features'][0]['properties']['summary']['duration'] / 60

    print(route)
    
    return geometry, distance_km, duration_min

  except Exception as e:
    raise


def get_distance_matrix(points: List[List[float]], profile: Literal["driving-car", "driving-hgv"]):
  """
  Build distance matrix using ORS API.
  Points must be in format [[lat, lon], [lat, lon], ...].
  """
  coords = [(lon, lat) for lat, lon in points]  # ORS expects (lon, lat)

  try:
    matrix = distance_matrix(
      client,
      locations=coords,
      profile=profile,
      metrics=['distance'],
      units='km'
    )
    return matrix['distances']
  except Exception as e:
    raise

