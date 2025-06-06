# EcoRoute

**EcoRoute** is a platform designed to streamline garbage collection procedures for environmental service companies. It provides real-time coordination between all actors in the trash collection process—from customers and drivers to fleet managers—ensuring efficiency and transparency throughout the entire waste collection lifecycle.

---

## 🚀 Key Features

### 👥 Customer
- Create and manage trash collection orders  
- Track assigned driver location in real-time  
- Receive status updates and push notifications  

### 🚚 Driver
- Receive assigned collection routes  
- Navigate to collection points  
- Check-in and update order status in real-time  

### 🧑‍💼 Manager
- Monitor users, orders, vehicles and depots
- Real-time tracking of all vehicles and orders  
- Create and manage dispatch schedules  
- Built-in solver with support for multi-depot VRP and dynamic order handling  

---

## 🛠️ Technologies Used

- **Spring Boot (Java 21)** – Backend API (business logic)
- **FastAPI (Python 3.11)** – Vehicle Routing Problem (VRP) solver
- **React (Node.js 22+)** – Manager web interface
- **React Native (Expo)** – Mobile apps for drivers and customers
- **PostgreSQL** – Relational database
- **MinIO** – Object storage for assets (e.g., driver documents, photos)
- **Firebase Realtime Database & Cloud Messaging** – Real-time sync and push notifications
- **Docker** – Containerized local development
- **OpenAPI/Swagger** – API documentation
- **Nginx** - Reverse proxy for routing traffic to backend, frontend, and API services

---

## ⚡ Getting Started

### 🧰 Prerequisites

- Java 21  
- Python 3.11  
- Node.js 22+  
- Docker  
- Android Studio  
- Firebase Project Setup (Realtime DB + FCM)

---

## 🔧 Installation & Quick Start

Clone the repository:

```bash
git clone https://github.com/ducvu0907/eco-route.git
cd eco-route
```

Navigate into the main source directory:

```bash
cd src
```

Create a `.env` file and configure it according to .env.example.

Then start all services using Docker Compose:

```bash
docker compose up --build
```

The manager web interface should be available at: `http://localhost`

## Development Guide

### Backend (Spring Boot)

```bash
cd backend_java
sudo chmod +x dev.sh
./dev.sh
```
- This starts a development environment with PostgreSQL and MinIO using Docker
- Matches application-dev.yml configuration

Default API URL: `http://localhost:8080`

API documentation: `http://localhost:8080/docs`

### VRP Solver API (FastAPI)

```bash
cd backend_python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` and follow the .env.example format.

Start the API:

```bash
fastapi dev api_v2.py
```

Runs at: `http://localhost:8000`

### Web App (React)

```bash
cd web
npm install
```
Create a `.env` file and configure it according to `.env.example`

Start the development server:

```bash
npm run dev
```

Runs at: `http://localhost:5173` (default)

### Mobile App (React Native)

```bash
cd mobile_app
npm install
```

Create a `.env` file and configure it according to `.env.example`

Run on Android (via Expo):

```bash
npx expo run:android
```

**Note**: Make sure your emulator or physical device is running and connected.

