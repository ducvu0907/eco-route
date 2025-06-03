FROM python:3.11.12-bookworm

ARG DATABASE_URL
ARG ORS_API_KEY
ARG PRETRAINED_PATH

ENV DATABASE_URL=$DATABASE_URL
ENV ORS_API_KEY=$ORS_API_KEY
ENV PRETRAINED_PATH=$PRETRAINED_PATH

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && pip install -r requirements.txt

COPY . .
EXPOSE 8000
CMD ["fastapi", "run", "api_v2.py", "--port", "8000"]
