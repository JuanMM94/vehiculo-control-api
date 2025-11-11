# Vehicle Control API

REST API for vehicle control and management built with Node.js, Express, and PostgreSQL.

## Quick Start with Docker Compose

The easiest way to run this application is with Docker Compose:

```bash
# Download the production compose file
curl -O https://raw.githubusercontent.com/JuanMM94/vehiculo-control-api/main/docker-compose.prod.yml

# Start the application (API + PostgreSQL)
docker compose -f docker-compose.prod.yml up -d
```

This will:
- Pull and start PostgreSQL 16
- Pull and start the API on port 3000
- Automatically create the database and tables
- Set up networking between containers

## Access the Application

- **API Base URL**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api-docs

## Required Environment Variables

If you want to run the container individually (not recommended), you need to provide:

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - API port (default: 3000)

## Documentation

Full documentation available at: https://github.com/JuanMM94/vehiculo-control-api

## Features

- User authentication with JWT
- Role-based authorization (Admin/Operator)
- Vehicle management
- Vehicle state tracking
- Maintenance records
- Complete OpenAPI/Swagger documentation
- Automatic database creation and migrations
