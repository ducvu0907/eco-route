#!/bin/bash

docker stop postgres_dev && docker rm postgres_dev
docker stop minio_dev && docker rm minio_dev
set -e

echo "Starting PostgreSQL container..."
docker run --name postgres_dev \
  -e POSTGRES_DB=eco_route_db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=admin \
  -p 5432:5432 \
  -v eco_route_data:/var/lib/postgresql/data \
  -d postgres

echo "Starting MinIO container..."
docker run -d -p 9000:9000 -p 9001:9001 \
  --name minio_dev \
  -e MINIO_ROOT_USER=admin \
  -e MINIO_ROOT_PASSWORD=admin123 \
  -v ~/minio-data:/data \
  minio/minio server /data --console-address ":9001"

echo "Starting Spring Boot application..."
./mvnw spring-boot:run
