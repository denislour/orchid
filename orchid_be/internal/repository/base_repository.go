package repository

import (
	"context"
	"database/sql"
	"time"

	"orchid_be/internal/db"
)

type BaseRepository struct {
	db      *sql.DB
	queries *db.Queries
}

func NewBaseRepository(database *sql.DB) *BaseRepository {
	return &BaseRepository{
		db:      database,
		queries: db.New(database),
	}
}

func (r *BaseRepository) GetDB() *sql.DB {
	return r.db
}

func (r *BaseRepository) GetQueries() *db.Queries {
	return r.queries
}

func (r *BaseRepository) WithTimeout(ctx context.Context, timeout time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, timeout)
}

func (r *BaseRepository) BeginTransaction(ctx context.Context) (*sql.Tx, error) {
	return r.db.BeginTx(ctx, nil)
}

func (r *BaseRepository) CommitTransaction(tx *sql.Tx) error {
	return tx.Commit()
}

func (r *BaseRepository) RollbackTransaction(tx *sql.Tx) error {
	return tx.Rollback()
}
