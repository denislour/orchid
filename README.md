# Orchid Project

A full-stack web application with Go backend and Astro frontend.

## Project Overview

Orchid is a modern web application consisting of:

- **Backend**: Go API with PostgreSQL database
- **Frontend**: Astro dashboard with Tailwind CSS and Flowbite

## Quick Start with Docker

The easiest way to run the entire system is using Docker Compose:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL database
- Backend API server (port 8000)
- Frontend dashboard (port 3000)
- Traefik reverse proxy (port 80)

Access the application at:

- Frontend: http://localhost
- Backend API: http://localhost/api
- Traefik Dashboard: http://localhost:8080

## Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Traefik   │    │   Backend   │
│   (Astro)   │◄──►│  (Proxy)    │◄──►│    (Go)     │
│   Port 3000 │    │   Port 80   │    │  Port 8000  │
└─────────────┘    └─────────────┘    └─────────────┘
                                          │
                                          ▼
                                   ┌─────────────┐
                                   │ PostgreSQL  │
                                   │   Database  │
                                   │  Port 5432  │
                                   └─────────────┘
```

## Project Structure

```
orchid/
├── orchid_be/          # Backend Go application
│   ├── cmd/            # Application entry points
│   ├── internal/       # Private application code
│   ├── configs/        # Configuration files
│   ├── migrations/     # Database migrations
│   └── scripts/        # Utility scripts
├── orchid_fe/          # Frontend Astro application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── data/           # Static data files
├── docker-compose.yml  # Docker configuration
└── README.md          # This file
```

## Development Setup

### Backend Setup

See [orchid_be/README.md](orchid_be/README.md) for detailed backend setup instructions.

### Frontend Setup

See [orchid_fe/README.md](orchid_fe/README.md) for detailed frontend setup instructions.

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

```bash
cp .env.example .env
```

## Services

- **Frontend**: Astro dashboard with modern UI components
- **Backend**: RESTful API with authentication and CRUD operations
- **Database**: PostgreSQL for data persistence
- **Proxy**: Traefik for routing and load balancing

## Technologies Used

### Backend

- Go
- Gin (Web Framework)
- PostgreSQL
- SQLC (Query Builder)
- Viper (Configuration)

### Frontend

- Astro
- TypeScript
- Tailwind CSS
- Flowbite (UI Components)
- ApexCharts (Charts)

### DevOps

- Docker
- Docker Compose
- Traefik (Reverse Proxy)

# Todo

- Connect dc FE với BE (internal)
- review lại cac function FE, khoan restruct lại thiết kế mà kiểm tra xem rằng data được lấy dc đâu
- Viết lại cấu trúc BE users, products theo fe trước
- connect với BE, và nên để ở tầng service hoặc là tầng repo (hạn chế sửa tầng UI như astro, hoặc client.ts)
