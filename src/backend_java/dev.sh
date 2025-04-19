#!/bin/bash

echo "Starting PostgreSQL container..."
docker run --name postgres_dev \
  -e POSTGRES_DB=eco_route_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -p 5432:5432 \
  -v eco_route_data:/var/lib/postgresql/data \
  -d postgres

echo "Starting Spring Boot application..."
./mvnw spring-boot:run

trap "echo 'Stopping PostgreSQL container...'; docker stop postgres_dev && docker rm postgres_dev" EXIT