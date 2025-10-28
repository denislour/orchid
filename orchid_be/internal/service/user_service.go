package service

import (
	"context"
	"errors"
	"fmt"

	"orchid_be/internal/repository"
	"orchid_be/internal/utils"
)

type UserService interface {
	CreateUser(ctx context.Context, req *CreateUserRequest) (*UserResponse, error)
	GetUserByID(ctx context.Context, id int) (*UserResponse, error)
	GetAllUsers(ctx context.Context, page, limit int) ([]*UserResponse, int, error)
	UpdateUser(ctx context.Context, id int, req *UpdateUserRequest) (*UserResponse, error)
	DeleteUser(ctx context.Context, id int) error
}

type userService struct {
	*BaseService
	userRepo repository.UserRepository
}

func NewUserService(userRepo repository.UserRepository) UserService {
	return &userService{
		BaseService: NewBaseService(),
		userRepo:    userRepo,
	}
}

func (s *userService) CreateUser(ctx context.Context, req *CreateUserRequest) (*UserResponse, error) {
	ctx, cancel := s.WithTimeout(ctx, s.DefaultTimeout())
	defer cancel()

	_, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil {
		// User found with this email
		return nil, errors.New("email already exists")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user, err := s.userRepo.Create(ctx, req.Name, req.Email, hashedPassword)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return ToUserResponse(user), nil
}

func (s *userService) GetUserByID(ctx context.Context, id int) (*UserResponse, error) {
	ctx, cancel := s.WithTimeout(ctx, s.DefaultTimeout())
	defer cancel()

	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return ToUserResponse(user), nil
}

func (s *userService) GetAllUsers(ctx context.Context, page, limit int) ([]*UserResponse, int, error) {
	ctx, cancel := s.WithTimeout(ctx, s.DefaultTimeout())
	defer cancel()

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	users, err := s.userRepo.GetAll(ctx, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get users: %w", err)
	}

	total, err := s.userRepo.Count(ctx)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	userResponses := make([]*UserResponse, len(users))
	for i, user := range users {
		userResponses[i] = ToUserResponse(user)
	}

	return userResponses, total, nil
}

func (s *userService) UpdateUser(ctx context.Context, id int, req *UpdateUserRequest) (*UserResponse, error) {
	ctx, cancel := s.WithTimeout(ctx, s.DefaultTimeout())
	defer cancel()

	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	// Check if email is being updated and if it already exists
	if req.Email != nil && *req.Email != user.Email {
		existingUser, err := s.userRepo.GetByEmail(ctx, *req.Email)
		if err == nil && existingUser.ID != int32(id) {
			return nil, errors.New("email already exists")
		}
		user.Email = *req.Email
	}

	if req.Name != nil {
		user.Name = *req.Name
	}

	updatedUser, err := s.userRepo.Update(ctx, id, user.Name, user.Email, user.PasswordHash)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return ToUserResponse(updatedUser), nil
}

func (s *userService) DeleteUser(ctx context.Context, id int) error {
	ctx, cancel := s.WithTimeout(ctx, s.DefaultTimeout())
	defer cancel()

	if err := s.userRepo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}
