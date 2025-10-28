# Orchid Backend

Backend API được xây dựng với Go và PostgreSQL.

## Cài đặt dependencies

```bash
go mod tidy
```

## Development với Air (Live Reload)

### Cài đặt Air

Sử dụng script cài đặt:
```bash
chmod +x scripts/install_air.sh
./scripts/install_air.sh
```

Hoặc cài đặt thủ công:
```bash
go install github.com/air-verse/air@latest
```

### Chạy server với Air

```bash
air
```

Air sẽ tự động:
- Build và chạy server
- Watch các thay đổi trong code
- Restart server khi có thay đổi
- Build binary đến thư mục `./bin/api`
- Exclude các thư mục không cần thiết (vendor, tmp, .git, bin, docs, migrations, scripts, tests)

### Config Air

File config Air đã được tạo tại `.air.toml` với các thiết lập tối ưu cho development:
- Build binary đến `./bin/api`
- Auto-restart khi code thay đổi
- Exclude test files và các thư mục không cần watch

## Build project

```bash
go build -o bin/api cmd/api/main.go
```

## Run server (không dùng Air)

```bash
go run cmd/api/main.go
```

Server sẽ chạy trên port 8080.

## Cấu hình database

1. Tạo database PostgreSQL:
```sql
CREATE DATABASE orchid_db;
```

2. Chạy migration:
```bash
psql -d orchid_db -f migrations/001_create_users_table.sql
```

3. Cấu hình kết nối trong file `configs/config.yaml`:
```yaml
database:
  host: "localhost"
  port: "5432"
  user: "postgres"
  password: "password"
  dbname: "orchid_db"
  sslmode: "disable"
