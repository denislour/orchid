# Orchid Backend

Backend API built with Go and PostgreSQL.

## Install Dependencies

```bash
go mod tidy
```

## Development with Air (Live Reload)

### Install Air

Using script:
```bash
chmod +x scripts/install_air.sh
./scripts/install_air.sh
```

Or install manually:
```bash
go install github.com/air-verse/air@latest
```

### Run Server with Air

```bash
air
```

Air will automatically:
- Build and run server
- Watch for code changes
- Restart server when changes are made
- Build binary to `./bin/api` directory
- Exclude unnecessary folders (vendor, tmp, .git, bin, docs, migrations, scripts, tests)

### Air Configuration

Air config file is created at `.air.toml` with optimal settings for development:
- Build binary to `./bin/api`
- Auto-restart when code changes
- Exclude test files and unnecessary folders from watching

## Build Project

```bash
go build -o bin/api cmd/api/main.go
```

## Run Server (without Air)

```bash
go run cmd/api/main.go
```

Server will run on port 8000.

## Database Configuration

1. Create PostgreSQL database:
```sql
CREATE DATABASE orchid_db;
```

2. Run migration:
```bash
psql -d orchid_db -f migrations/001_create_users_table.sql
```

3. Configure connection in `configs/config.yaml` file:
```yaml
database:
  host: "localhost"
  port: "5432"
  user: "postgres"
  password: "password"
  dbname: "orchid_db"
  sslmode: "disable"
