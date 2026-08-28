# CivicForge

SIH #43 CivicForge - A national civic-innovation platform.

## Architecture
- Frontend: Next.js 14
- Backend: Java 21 Spring Boot
- AI Service: Python FastAPI
- DB: PostgreSQL, Redis
- Object Storage: MinIO

## Prerequisites
- Docker & Docker Compose
- Java 21
- Node 20
- Python 3.11

## Quick Start
1. Clone repo
2. `cp .env.example .env`
3. `docker-compose -f infrastructure/docker-compose.yml up -d`

## Service URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui/index.html
- Grafana: http://localhost:3001
- MinIO: http://localhost:9001