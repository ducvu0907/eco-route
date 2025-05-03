import os
from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select
import uvicorn
import logging
from dotenv import load_dotenv
load_dotenv()

# logger
FORMAT = "%(levelprefix)s  %(asctime)s  %(message)s"
logger = logging.getLogger("logger")
logger.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = uvicorn.logging.DefaultFormatter(FORMAT, datefmt="%Y-%m-%d %H:%M:%S")
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# db
database_url = os.getenv("DATABASE_URL")
engine = create_engine(database_url)

def create_db_and_tables():
  SQLModel.metadata.create_all(engine)
create_db_and_tables()

def get_session():
  with Session(engine) as session:
    yield session

SessionDep = Annotated[Session, Depends(get_session)]

# cors
cors_origins_raw = os.getenv("CORS_ORIGINS")
origins = [origin.strip() for origin in cors_origins_raw.split(",") if origin.strip()]

# app
app = FastAPI()
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# apis
@app.get("/")
def root():
  return {"message": "root"}

@app.get("/test")
def test(session: SessionDep):
  logger.info(f"{session.is_active}")
  return {"message": "db connection is working"}
