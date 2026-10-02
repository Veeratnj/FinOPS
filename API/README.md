# Ctrls-API

FastAPI-based backend application following a layered architecture with clear separation of concerns for APIs, business logic, database operations, and utilities.

## Project Structure

```text
app/
├── api/                    # API layer
│   ├── deps.py             # Dependencies (auth, DB)
│   └── v1/endpoints/       # Endpoint routers
├── core/                   # Core functionality
│   ├── config.py           # Application settings
│   ├── security.py         # JWT, password hashing
│   └── logging.py          # Structured logging
├── db/                     # Database layer
│   ├── session.py          # Database session management
│   └── migrations/         # Alembic migrations
├── models/                 # SQLAlchemy models
├── schemas/                # Pydantic schemas
├── repositories/           # Data access layer
├── services/               # Business logic layer
└── utils/                  # Utility functions
```

## Prerequisites

* Python 3.12+
* pip
* Docker (for local testing)

## Local Development Setup

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
uvicorn app.main:app --reload
```

The API will be available at:

* Application: `http://localhost:8000`
* Swagger Documentation: `http://localhost:8000/docs`
* ReDoc Documentation: `http://localhost:8000/redoc`

---

# Docker Usage (Testing Environment Only)

> **Note:** Docker is currently used **only for local development and testing purposes**.
>
> **Production deployments do not use Docker** and follow the organization's standard server deployment process.

## Build Docker Image

```bash
docker build -t ctrls-api .
```

Verify the image:

```bash
docker images
```

## Run Docker Container

```bash
docker run -d \
  --name ctrls-api-container \
  -p 8000:8000 \
  ctrls-api
```

## View Container Logs

```bash
docker logs -f ctrls-api-container
```

## Access the Application

* API: `http://localhost:8000`
* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

## Stop Container

```bash
docker stop ctrls-api-container
```

## Start Existing Container

```bash
docker start ctrls-api-container
```

## Remove Container

```bash
docker rm -f ctrls-api-container
```

## Remove Docker Image

```bash
docker rmi ctrls-api
```

If the image is in use:

```bash
docker rm -f ctrls-api-container
docker rmi ctrls-api
```

---

# Database Migrations

If using Alembic for database migrations:

### Create Migration

```bash
alembic revision --autogenerate -m "migration message"
```

### Apply Migrations

```bash
alembic upgrade head
```

### Rollback Last Migration

```bash
alembic downgrade -1
```

---

# Production Deployment

* Docker is **not used** in production.
* The application is deployed directly on the target server environment.
* Docker configurations should be treated as **development/testing utilities only**.

---

# API Documentation

Once the application is running, interactive API documentation is available at:

* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`
