package service

import (
	"time"

	"orchid_be/internal/db"
)

type CreateUserRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type UpdateUserRequest struct {
	Name  *string `json:"name,omitempty"`
	Email *string `json:"email,omitempty"`
}

type UserResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToUserResponse(user db.User) *UserResponse {
	resp := &UserResponse{
		ID:    int(user.ID),
		Name:  user.Name,
		Email: user.Email,
	}

	if user.CreatedAt.Valid {
		resp.CreatedAt = user.CreatedAt.Time
	}

	if user.UpdatedAt.Valid {
		resp.UpdatedAt = user.UpdatedAt.Time
	}

	return resp
}
