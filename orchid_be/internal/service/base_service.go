package service

import (
	"context"
	"time"
)

type BaseService struct{}

func NewBaseService() *BaseService {
	return &BaseService{}
}

func (s *BaseService) WithTimeout(ctx context.Context, timeout time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(ctx, timeout)
}

func (s *BaseService) DefaultTimeout() time.Duration {
	return 30 * time.Second
}
