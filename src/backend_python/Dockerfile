# FROM python:3.11.12-bookworm
#
# ARG DATABASE_URL
# ARG ORS_API_KEY
# ARG PRETRAINED_PATH
#
# ENV DATABASE_URL=$DATABASE_URL
# ENV ORS_API_KEY=$ORS_API_KEY
# ENV PRETRAINED_PATH=$PRETRAINED_PATH
#
# WORKDIR /app
# COPY requirements-prod.txt .
# RUN pip install --no-cache-dir --upgrade pip && pip install -r requirements-prod.txt
#
# COPY . .
# # EXPOSE 8000
# # CMD ["fastapi", "run", "api_v2.py", "--port", "8000"]
# CMD ["uvicorn", "api_v2:app", "--host", "0.0.0.0", "--port", "8000"]

# FROM pytorch/pytorch:2.1.0-cuda11.8-cudnn8-runtime
#
# # Set environment variables
# ENV DATABASE_URL=${DATABASE_URL}
# ENV ORS_API_KEY=${ORS_API_KEY}
# ENV PRETRAINED_PATH=${PRETRAINED_PATH}
#
# # Set working directory
# WORKDIR /app
#
# # Copy and install only production requirements (torch already present)
# COPY requirements-prod.txt .
# RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements-prod.txt
#
# # Copy the rest of the application
# COPY . .
#
# # Expose app port (optional if you're not using EXPOSE in docker-compose)
# EXPOSE 8000
#
# # Run the FastAPI app using uvicorn
# CMD ["uvicorn", "api_v2:app", "--host", "0.0.0.0", "--port", "8000"]

FROM pytorch/pytorch:2.1.0-cuda12.1-cudnn8-runtime

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    python3-dev \
    tzdata \
 && ln -fs /usr/share/zoneinfo/Etc/UTC /etc/localtime \
 && dpkg-reconfigure --frontend noninteractive tzdata \
 && rm -rf /var/lib/apt/lists/*

# Environment vars
ENV DATABASE_URL=${DATABASE_URL}
ENV ORS_API_KEY=${ORS_API_KEY}
ENV PRETRAINED_PATH=${PRETRAINED_PATH}

# Workdir
WORKDIR /app

# Install Python deps (torch already included)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api_v2:app", "--host", "0.0.0.0", "--port", "8000"]
