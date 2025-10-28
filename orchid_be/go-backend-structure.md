# Cấu Trúc Project Backend Go với Gin, SQLX và PostgreSQL

## Tổng Quan

Đây là cấu trúc project backend Go được thiết kế theo best practices, sử dụng Gin framework cho HTTP routing, SQLX cho database operations và PostgreSQL làm database. Cấu trúc này tuân theo kiến trúc layer (layered architecture) với sự phân tách rõ ràng giữa các thành phần.

## Cấu Trúc Thư Mục

```
orchid_be/
├── cmd/
│   └── api/
│       └── main.go                 # Entry point của ứng dụng
├── internal/
│   ├── config/
│   │   ├── config.go              # Cấu hình ứng dụng
│   │   └── database.go            # Cấu hình database
│   ├── controller/
│   │   ├── user_controller.go     # Handler cho user endpoints
│   │   └── base_controller.go     # Base controller với common functions
│   ├── middleware/
│   │   ├── auth.go                # Authentication middleware
│   │   ├── cors.go                # CORS middleware
│   │   ├── logger.go              # Logging middleware
│   │   └── validation.go          # Request validation middleware
│   ├── model/
│   │   ├── user.go                # User model và structs
│   │   └── base_model.go          # Base model với common fields
│   ├── repository/
│   │   ├── user_repository.go     # Database operations cho user
│   │   └── base_repository.go     # Base repository với common functions
│   ├── service/
│   │   ├── user_service.go        # Business logic cho user
│   │   └── base_service.go        # Base service với common functions
│   └── utils/
│       ├── response.go            # Response utilities
│       ├── validator.go           # Validation utilities
│       └── password.go            # Password hashing utilities
├── migrations/
│   ├── 001_create_users_table.sql # Migration cho users table
│   └── 002_create_products_table.sql # Migration cho products table
├── pkg/
│   ├── database/
│   │   ├── postgres.go            # PostgreSQL connection setup
│   │   └── migrations.go          # Migration runner
│   └── logger/
│       └── logger.go              # Logger setup
├── configs/
│   ├── config.yaml                # Configuration file
│   ├── config.dev.yaml            # Development config
│   └── config.prod.yaml           # Production config
├── docs/
│   └── api.md                     # API documentation
├── scripts/
│   ├── build.sh                   # Build script
│   └── migrate.sh                 # Migration script
├── tests/
│   ├── integration/
│   │   └── user_test.go           # Integration tests
│   └── unit/
│       ├── user_service_test.go   # Unit tests for service
│       └── user_repository_test.go # Unit tests for repository
├── go.mod                         # Go modules file
├── go.sum                         # Go modules checksum
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose configuration
├── .env.example                   # Environment variables example
├── .gitignore                     # Git ignore file
└── README.md                      # Project documentation
```

## Kiến Trúc Layer

### 1. Controller Layer (Handler)
- **Vị trí**: `internal/controller/`
- **Trách nhiệm**:
  - Nhận HTTP requests
  - Validate input
  - Gọi service layer
  - Return HTTP responses
- **Components**:
  - `user_controller.go`: Xử lý các endpoint liên quan đến user
  - `base_controller.go`: Chứa các hàm chung cho tất cả controllers

### 2. Service Layer
- **Vị trí**: `internal/service/`
- **Trách nhiệm**:
  - Business logic
  - Data transformation
  - Gọi repository layer
- **Components**:
  - `user_service.go`: Business logic cho user operations
  - `base_service.go`: Common service functions

### 3. Repository Layer
- **Vị trí**: `internal/repository/`
- **Trách nhiệm**:
  - Database operations
  - SQL queries
  - Data persistence
- **Components**:
  - `user_repository.go`: Database operations cho user
  - `base_repository.go`: Common repository functions

### 4. Model Layer
- **Vị trí**: `internal/model/`
- **Trách nhiệm**:
  - Data structures
  - Database entities
  - DTOs (Data Transfer Objects)
- **Components**:
  - `user.go`: User model và related structs
  - `base_model.go`: Common model fields

## CRUD Operations cho User Entity

### 1. Model Structure

```go
// internal/model/user.go
type User struct {
    ID          int       `json:"id" db:"id"`
    Name        string    `json:"name" db:"name"`
    Email       string    `json:"email" db:"email"`
    Avatar      string    `json:"avatar" db:"avatar"`
    Biography   string    `json:"biography" db:"biography"`
    Position    string    `json:"position" db:"position"`
    Country     string    `json:"country" db:"country"`
    Status      string    `json:"status" db:"status"`
    Password    string    `json:"-" db:"password"` // Hidden in JSON
    CreatedAt   time.Time `json:"created_at" db:"created_at"`
    UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// DTOs cho các operations
type CreateUserRequest struct {
    Name      string `json:"name" validate:"required"`
    Email     string `json:"email" validate:"required,email"`
    Password  string `json:"password" validate:"required,min=6"`
    Biography string `json:"biography"`
    Position  string `json:"position"`
    Country   string `json:"country"`
}

type UpdateUserRequest struct {
    Name      *string `json:"name,omitempty"`
    Biography *string `json:"biography,omitempty"`
    Position  *string `json:"position,omitempty"`
    Country   *string `json:"country,omitempty"`
    Status    *string `json:"status,omitempty"`
}

type UserResponse struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    Avatar    string    `json:"avatar"`
    Biography string    `json:"biography"`
    Position  string    `json:"position"`
    Country   string    `json:"country"`
    Status    string    `json:"status"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

### 2. Repository Interface

```go
// internal/repository/user_repository.go
type UserRepository interface {
    Create(ctx context.Context, user *model.User) error
    GetByID(ctx context.Context, id int) (*model.User, error)
    GetByEmail(ctx context.Context, email string) (*model.User, error)
    GetAll(ctx context.Context, limit, offset int) ([]*model.User, error)
    Update(ctx context.Context, user *model.User) error
    Delete(ctx context.Context, id int) error
    Count(ctx context.Context) (int, error)
}
```

### 3. Service Interface

```go
// internal/service/user_service.go
type UserService interface {
    CreateUser(ctx context.Context, req *model.CreateUserRequest) (*model.UserResponse, error)
    GetUserByID(ctx context.Context, id int) (*model.UserResponse, error)
    GetAllUsers(ctx context.Context, page, limit int) ([]*model.UserResponse, int, error)
    UpdateUser(ctx context.Context, id int, req *model.UpdateUserRequest) (*model.UserResponse, error)
    DeleteUser(ctx context.Context, id int) error
}
```

### 4. Controller Endpoints

```go
// internal/controller/user_controller.go
// GET /api/v1/users
func (c *UserController) GetUsers(ctx *gin.Context)

// GET /api/v1/users/:id
func (c *UserController) GetUserByID(ctx *gin.Context)

// POST /api/v1/users
func (c *UserController) CreateUser(ctx *gin.Context)

// PUT /api/v1/users/:id
func (c *UserController) UpdateUser(ctx *gin.Context)

// DELETE /api/v1/users/:id
func (c *UserController) DeleteUser(ctx *gin.Context)
```

## File Config Cần Thiết

### 1. Configuration Files

```yaml
# configs/config.yaml
server:
  host: "localhost"
  port: 8080
  mode: "debug" # debug, release, test

database:
  host: "localhost"
  port: 5432
  user: "postgres"
  password: "password"
  dbname: "orchid_db"
  sslmode: "disable"
  max_open_conns: 25
  max_idle_conns: 5
  conn_max_lifetime: 300

jwt:
  secret: "your-secret-key"
  expiration: 24h

logger:
  level: "info"
  format: "json"
```

### 2. Environment Variables

```bash
# .env.example
SERVER_HOST=localhost
SERVER_PORT=8080
SERVER_MODE=debug

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=orchid_db
DB_SSLMODE=disable

JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

LOG_LEVEL=info
LOG_FORMAT=json
```

### 3. Configuration Structure

```go
// internal/config/config.go
type Config struct {
    Server   ServerConfig   `yaml:"server"`
    Database DatabaseConfig `yaml:"database"`
    JWT      JWTConfig      `yaml:"jwt"`
    Logger   LoggerConfig   `yaml:"logger"`
}

type ServerConfig struct {
    Host string `yaml:"host"`
    Port int    `yaml:"port"`
    Mode string `yaml:"mode"`
}

type DatabaseConfig struct {
    Host            string `yaml:"host"`
    Port            int    `yaml:"port"`
    User            string `yaml:"user"`
    Password        string `yaml:"password"`
    DBName          string `yaml:"dbname"`
    SSLMode         string `yaml:"sslmode"`
    MaxOpenConns    int    `yaml:"max_open_conns"`
    MaxIdleConns    int    `yaml:"max_idle_conns"`
    ConnMaxLifetime int    `yaml:"conn_max_lifetime"`
}

type JWTConfig struct {
    Secret     string        `yaml:"secret"`
    Expiration time.Duration `yaml:"expiration"`
}

type LoggerConfig struct {
    Level  string `yaml:"level"`
    Format string `yaml:"format"`
}
```

## Database Migrations

### 1. Migration Structure

```sql
-- migrations/001_create_users_table.sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    biography TEXT,
    position VARCHAR(255),
    country VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email
CREATE INDEX idx_users_email ON users(email);

-- Create index for status
CREATE INDEX idx_users_status ON users(status);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Migration Runner

```go
// pkg/database/migrations.go
type Migration struct {
    Version int
    Name    string
    SQL     string
}

func RunMigrations(db *sqlx.DB, migrationsPath string) error {
    // Create migrations table if not exists
    // Read migration files
    // Execute pending migrations
    // Update migrations table
}
```

### 3. Migration Script

```bash
#!/bin/bash
# scripts/migrate.sh

# Up migrations
migrate -path migrations -database "postgres://user:password@localhost/dbname?sslmode=disable" up

# Down migrations
migrate -path migrations -database "postgres://user:password@localhost/dbname?sslmode=disable" down

# Create new migration
migrate create -ext sql -dir migrations -seq create_new_table
```

## Dependency Injection

### 1. Container Structure

```go
// internal/container/container.go
type Container struct {
    Config     *config.Config
    DB         *sqlx.DB
    Logger     logger.Logger

    // Repositories
    UserRepo repository.UserRepository

    // Services
    UserService service.UserService

    // Controllers
    UserController *controller.UserController
}

func NewContainer() (*Container, error) {
    // Initialize config
    // Initialize database
    // Initialize logger
    // Initialize repositories
    // Initialize services
    // Initialize controllers
    // Return container
}
```

### 2. Main Application

```go
// cmd/api/main.go
func main() {
    container, err := container.NewContainer()
    if err != nil {
        log.Fatal(err)
    }

    router := gin.New()

    // Setup middleware
    router.Use(middleware.Logger(container.Logger))
    router.Use(middleware.Cors())
    router.Use(middleware.Recovery())

    // Setup routes
    v1 := router.Group("/api/v1")
    container.UserController.RegisterRoutes(v1)

    // Start server
    server := &http.Server{
        Addr:    fmt.Sprintf(":%d", container.Config.Server.Port),
        Handler: router,
    }

    log.Fatal(server.ListenAndServe())
}
```

## Testing Structure

### 1. Unit Tests

```go
// tests/unit/user_service_test.go
func TestUserService_CreateUser(t *testing.T) {
    // Setup
    mockRepo := &MockUserRepository{}
    service := service.NewUserService(mockRepo)

    // Test cases
    tests := []struct {
        name    string
        request *model.CreateUserRequest
        want    *model.UserResponse
        wantErr bool
    }{
        // Test cases here
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // Test implementation
        })
    }
}
```

### 2. Integration Tests

```go
// tests/integration/user_test.go
func TestUserEndpoints(t *testing.T) {
    // Setup test database
    // Setup test server
    // Test endpoints
    // Cleanup
}
```

## Best Practices

### 1. Error Handling
- Sử dụng custom error types
- Consistent error response format
- Proper logging for errors

### 2. Validation
- Input validation ở controller layer
- Business rule validation ở service layer
- Database constraint validation

### 3. Security
- Password hashing với bcrypt
- JWT authentication
- Input sanitization
- SQL injection prevention với SQLX

### 4. Performance
- Database connection pooling
- Proper indexing
- Pagination cho large datasets
- Caching strategies

### 5. Logging
- Structured logging
- Different log levels
- Request/response logging
- Error tracking

### 6. Documentation
- API documentation với Swagger/OpenAPI
- Code comments
- README with setup instructions

## Deployment

### 1. Docker Configuration

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main cmd/api/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/configs ./configs

EXPOSE 8080
CMD ["./main"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=postgres
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=orchid_db
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=orchid_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Kết Luận

Cấu trúc này cung cấp một foundation vững chắc cho ứng dụng backend Go với:
- Phân tách rõ ràng giữa các layer
- Dễ dàng mở rộng và bảo trì
- Testing-friendly architecture
- Best practices cho security và performance
- Deployment-ready configuration

Cấu trúc này có thể dễ dàng mở rộng để thêm các entities và features mới mà không làm ảnh hưởng đến các thành phần hiện có.


## Architecture Diagrams

### 1. Overall Architecture Flow

```mermaid
graph TB
    Client[Client/Frontend] --> LB[Load Balancer]
    LB --> API[API Gateway]
    API --> MW[Middleware Layer]
    MW --> UC[User Controller]
    MW --> PC[Product Controller]
    UC --> US[User Service]
    PC --> PS[Product Service]
    US --> UR[User Repository]
    PS --> PR[Product Repository]
    UR --> DB[(PostgreSQL)]
    PR --> DB

    subgraph "Application Layers"
        MW
        UC
        US
        UR
    end

    subgraph "Infrastructure"
        DB
    end
```

### 2. Request Flow Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant H as Handler/Controller
    participant S as Service
    participant R as Repository
    participant DB as Database

    C->>H: HTTP Request
    H->>H: Validate Input
    H->>S: Call Service Method
    S->>S: Business Logic
    S->>R: Call Repository Method
    R->>DB: SQL Query
    DB-->>R: Query Result
    R-->>S: Domain Model
    S-->>H: Response DTO
    H-->>C: HTTP Response
```

### 3. Database Schema

```mermaid
erDiagram
    users {
        int id PK
        string name
        string email UK
        string password
        string avatar
        text biography
        string position
        string country
        string status
        timestamp created_at
        timestamp updated_at
    }

    products {
        int id PK
        string name
        string category
        string technology
        text description
        string price
        string discount
        timestamp created_at
        timestamp updated_at
    }
```

### 4. Dependency Injection Flow

```mermaid
graph LR
    Config[Config] --> Container[Container]
    DB[(Database)] --> Container
    Logger[Logger] --> Container

    Container --> Repo[Repository Layer]
    Container --> Service[Service Layer]
    Container --> Controller[Controller Layer]

    Repo --> Service
    Service --> Controller
    Controller --> Router[Router]
    Router --> Server[HTTP Server]
```


## Hướng Dẫn Triển Khai

### 1. Setup Project

```bash
# 1. Tạo project directory
mkdir orchid_be
cd orchid_be

# 2. Khởi tạo Go module
go mod init github.com/your-org/orchid_be

# 3. Cài đặt dependencies
go get -u github.com/gin-gonic/gin
go get -u github.com/jmoiron/sqlx
go get -u github.com/lib/pq
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/spf13/viper
go get -u github.com/sirupsen/logrus
go get -u golang.org/x/crypto/bcrypt
go get -u github.com/go-playground/validator/v10

# 4. Tạo cấu trúc thư mục
mkdir -p {cmd/api,internal/{config,controller,middleware,model,repository,service,utils},pkg/{database,logger},migrations,configs,docs,scripts,tests/{integration,unit}}
```

### 2. Development Workflow

```bash
# 1. Chạy database với Docker Compose
docker-compose up -d postgres

# 2. Chạy migrations
./scripts/migrate.sh up

# 3. Chạy server trong development mode
go run cmd/api/main.go

# 4. Chạy tests
go test ./tests/unit/...
go test ./tests/integration/...

# 5. Build cho production
./scripts/build.sh
```

### 3. Environment Setup

```bash
# Development
export GO_ENV=development
export CONFIG_PATH=./configs/config.dev.yaml

# Production
export GO_ENV=production
export CONFIG_PATH=./configs/config.prod.yaml
```

## Các Bước Tiếp Theo

### 1. Implementation Priority

1. **Phase 1: Core Foundation**
   - Setup project structure
   - Configuration management
   - Database connection
   - Basic logging

2. **Phase 2: User Management**
   - User model và repository
   - User service với CRUD operations
   - User controller với REST endpoints
   - Authentication middleware

3. **Phase 3: Advanced Features**
   - Product management
   - File upload handling
   - Caching layer
   - Rate limiting

4. **Phase 4: Production Ready**
   - Comprehensive testing
   - Monitoring và metrics
   - CI/CD pipeline
   - Documentation

### 2. Recommended Libraries

```go
// Authentication
"github.com/golang-jwt/jwt/v5"
"golang.org/x/crypto/bcrypt"

// Validation
"github.com/go-playground/validator/v10"

// Configuration
"github.com/spf13/viper"

// Logging
"github.com/sirupsen/logrus"
"go.uber.org/zap"

// Database Migrations
"github.com/golang-migrate/migrate/v4"
"github.com/golang-migrate/migrate/v4/database/postgres"
"github.com/golang-migrate/migrate/v4/source/file"

// Testing
"github.com/stretchr/testify/assert"
"github.com/stretchr/testify/mock"
"github.com/golang/mock/gomock"

// Utilities
"github.com/google/uuid"
"github.com/pkg/errors"
```

### 3. Performance Considerations

1. **Database Optimization**
   - Proper indexing strategy
   - Connection pooling configuration
   - Query optimization
   - N+1 query prevention

2. **Caching Strategy**
   - Redis for session storage
   - Application-level caching
   - Database query caching

3. **API Performance**
   - Response compression
   - Pagination implementation
   - Rate limiting
   - Request timeout handling

### 4. Security Best Practices

1. **Authentication & Authorization**
   - JWT token management
   - Role-based access control
   - Password strength requirements
   - Session management

2. **Data Protection**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - CORS configuration

3. **Infrastructure Security**
   - Environment variable management
   - Secret management
   - SSL/TLS configuration
   - Security headers
