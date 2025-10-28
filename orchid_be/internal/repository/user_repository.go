package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"orchid_be/internal/db"
)

type UserRepository interface {
	Create(ctx context.Context, name, email, passwordHash string) (db.User, error)
	GetByID(ctx context.Context, id int) (db.User, error)
	GetByEmail(ctx context.Context, email string) (db.User, error)
	GetAll(ctx context.Context, limit, offset int) ([]db.User, error)
	Update(ctx context.Context, id int, name, email, passwordHash string) (db.User, error)
	Delete(ctx context.Context, id int) error
	Count(ctx context.Context) (int, error)
}

type userRepository struct {
	*BaseRepository
}

func NewUserRepository(database *sql.DB) UserRepository {
	return &userRepository{
		BaseRepository: NewBaseRepository(database),
	}
}

func (r *userRepository) Create(ctx context.Context, name, email, passwordHash string) (db.User, error) {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	now := time.Now()
	createUserParams := db.CreateUserParams{
		Name:         name,
		Email:        email,
		PasswordHash: passwordHash,
		CreatedAt:    sql.NullTime{Time: now, Valid: true},
		UpdatedAt:    sql.NullTime{Time: now, Valid: true},
	}

	result, err := r.GetQueries().CreateUser(ctx, createUserParams)
	if err != nil {
		return db.User{}, fmt.Errorf("failed to create user: %w", err)
	}

	return result, nil
}

func (r *userRepository) GetByID(ctx context.Context, id int) (db.User, error) {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	dbUser, err := r.GetQueries().GetUserByID(ctx, int32(id))
	if err != nil {
		if err == sql.ErrNoRows {
			return db.User{}, fmt.Errorf("user with id %d not found", id)
		}
		return db.User{}, fmt.Errorf("failed to get user by id: %w", err)
	}

	return dbUser, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (db.User, error) {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	dbUser, err := r.GetQueries().GetUserByEmail(ctx, email)
	if err != nil {
		if err == sql.ErrNoRows {
			return db.User{}, fmt.Errorf("user with email %s not found", email)
		}
		return db.User{}, fmt.Errorf("failed to get user by email: %w", err)
	}

	return dbUser, nil
}

func (r *userRepository) GetAll(ctx context.Context, limit, offset int) ([]db.User, error) {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	getAllUsersParams := db.GetAllUsersParams{
		Limit:  int32(limit),
		Offset: int32(offset),
	}

	dbUsers, err := r.GetQueries().GetAllUsers(ctx, getAllUsersParams)
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %w", err)
	}

	return dbUsers, nil
}

func (r *userRepository) Update(ctx context.Context, id int, name, email, passwordHash string) (db.User, error) {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	now := time.Now()
	updateUserParams := db.UpdateUserParams{
		ID:           int32(id),
		Name:         name,
		Email:        email,
		PasswordHash: passwordHash,
		UpdatedAt:    sql.NullTime{Time: now, Valid: true},
	}

	result, err := r.GetQueries().UpdateUser(ctx, updateUserParams)
	if err != nil {
		if err == sql.ErrNoRows {
			return db.User{}, fmt.Errorf("user with id %d not found", id)
		}
		return db.User{}, fmt.Errorf("failed to update user: %w", err)
	}

	return result, nil
}

func (r *userRepository) Delete(ctx context.Context, id int) error {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	err := r.GetQueries().DeleteUser(ctx, int32(id))
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}

func (r *userRepository) Count(ctx context.Context) (int, error) {
	ctx, cancel := r.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	count, err := r.GetQueries().CountUsers(ctx)
	if err != nil {
		return 0, fmt.Errorf("failed to count users: %w", err)
	}

	return int(count), nil
}
