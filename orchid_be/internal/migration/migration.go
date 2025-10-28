package migration

import (
	"database/sql"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	_ "github.com/lib/pq"
)

// RunMigrations executes all SQL migration files in the specified directory
func RunMigrations(db *sql.DB, migrationsFS fs.FS, migrationsDir string) error {
	// Create migrations table if it doesn't exist
	if err := createMigrationsTable(db); err != nil {
		return err
	}

	// Get list of migration files
	files, err := fs.ReadDir(migrationsFS, migrationsDir)
	if err != nil {
		return err
	}

	// Sort files by name to ensure proper order
	var migrationFiles []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".sql") {
			migrationFiles = append(migrationFiles, file.Name())
		}
	}
	sort.Strings(migrationFiles)

	// Run each migration that hasn't been run yet
	for _, fileName := range migrationFiles {
		if err := runMigrationIfNeeded(db, migrationsFS, migrationsDir, fileName); err != nil {
			return err
		}
	}

	log.Println("All migrations completed successfully")
	return nil
}

// createMigrationsTable creates the schema_migrations table if it doesn't exist
func createMigrationsTable(db *sql.DB) error {
	query := `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			id SERIAL PRIMARY KEY,
			filename VARCHAR(255) NOT NULL UNIQUE,
			executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`
	_, err := db.Exec(query)
	return err
}

// runMigrationIfNeeded checks if a migration has been run and runs it if needed
func runMigrationIfNeeded(db *sql.DB, migrationsFS fs.FS, migrationsDir, fileName string) error {
	// Check if migration has already been run
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM schema_migrations WHERE filename = $1", fileName).Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Printf("Migration %s already executed, skipping", fileName)
		return nil
	}

	// Read migration file content
	filePath := filepath.Join(migrationsDir, fileName)
	content, err := fs.ReadFile(migrationsFS, filePath)
	if err != nil {
		return err
	}

	// Execute migration
	log.Printf("Running migration: %s", fileName)
	_, err = db.Exec(string(content))
	if err != nil {
		return err
	}

	// Record that migration has been executed
	_, err = db.Exec("INSERT INTO schema_migrations (filename) VALUES ($1)", fileName)
	if err != nil {
		return err
	}

	log.Printf("Migration %s completed successfully", fileName)
	return nil
}


// RunMigrationsFromPath executes all SQL migration files in the specified directory path
func RunMigrationsFromPath(db *sql.DB, migrationsPath string) error {
	// Create migrations table if it doesn't exist
	if err := createMigrationsTable(db); err != nil {
		return err
	}

	// Get list of migration files
	files, err := os.ReadDir(migrationsPath)
	if err != nil {
		return err
	}

	// Sort files by name to ensure proper order
	var migrationFiles []string
	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".sql") {
			migrationFiles = append(migrationFiles, file.Name())
		}
	}
	sort.Strings(migrationFiles)

	// Run each migration that hasn't been run yet
	for _, fileName := range migrationFiles {
		if err := runMigrationFromPathIfNeeded(db, migrationsPath, fileName); err != nil {
			return err
		}
	}

	log.Println("All migrations completed successfully")
	return nil
}

// runMigrationFromPathIfNeeded checks if a migration has been run and runs it if needed
func runMigrationFromPathIfNeeded(db *sql.DB, migrationsPath, fileName string) error {
	// Check if migration has already been run
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM schema_migrations WHERE filename = $1", fileName).Scan(&count)
	if err != nil {
		return err
	}

	if count > 0 {
		log.Printf("Migration %s already executed, skipping", fileName)
		return nil
	}

	// Read migration file content
	filePath := filepath.Join(migrationsPath, fileName)
	content, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	// Execute migration
	log.Printf("Running migration: %s", fileName)
	_, err = db.Exec(string(content))
	if err != nil {
		return err
	}

	// Record that migration has been executed
	_, err = db.Exec("INSERT INTO schema_migrations (filename) VALUES ($1)", fileName)
	if err != nil {
		return err
	}

	log.Printf("Migration %s completed successfully", fileName)
	return nil
}
