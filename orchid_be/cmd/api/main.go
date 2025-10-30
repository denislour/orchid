package main

import (
	"log"
	"net/http"
	"os"

	"orchid_be/docs"
	"orchid_be/internal/config"
	"orchid_be/internal/controller"
	"orchid_be/internal/migration"
	"orchid_be/internal/repository"
	"orchid_be/internal/service"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	cfg, err := config.LoadConfig("./configs")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := config.ConnectDB(&cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Run migrations
	migrationsPath := os.Getenv("MIGRATIONS_PATH")
	if migrationsPath == "" {
		migrationsPath = "./migrations"
	}

	if err := migration.RunMigrationsFromPath(db, migrationsPath); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}

	gin.SetMode(cfg.Server.Mode)

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	userRepo := repository.NewUserRepository(db)

	userService := service.NewUserService(userRepo)

	userController := controller.NewUserController(userService)

	userController.SetupRoutes(router)

	// Setup Swagger documentation
	docs.SwaggerInfo.BasePath = "/"
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "Server is running",
		})
	})

	addr := ":" + cfg.Server.Port
	log.Printf("Server starting on %s", addr)
	log.Printf("Health check available at http://localhost%s/health", addr)
	log.Printf("API endpoints available at http://localhost%s/api", addr)
	log.Printf("Swagger documentation available at http://localhost%s/swagger/index.html", addr)
	log.Printf("API endpoints available at http://localhost%s/api", addr)
	log.Printf("Swagger documentation available at http://localhost%s/swagger/index.html", addr)

	if err := router.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
