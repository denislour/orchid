package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, statusCode int, message string, err error) {
	errorMsg := message
	if err != nil {
		errorMsg = err.Error()
	}

	c.JSON(statusCode, Response{
		Success: false,
		Message: message,
		Error:   errorMsg,
	})
}

func Success(c *gin.Context, message string, data interface{}) {
	SuccessResponse(c, http.StatusOK, message, data)
}

func Created(c *gin.Context, message string, data interface{}) {
	SuccessResponse(c, http.StatusCreated, message, data)
}

func BadRequest(c *gin.Context, message string, err error) {
	ErrorResponse(c, http.StatusBadRequest, message, err)
}

func Unauthorized(c *gin.Context, message string, err error) {
	ErrorResponse(c, http.StatusUnauthorized, message, err)
}

func NotFound(c *gin.Context, message string, err error) {
	ErrorResponse(c, http.StatusNotFound, message, err)
}

func InternalServerError(c *gin.Context, message string, err error) {
	ErrorResponse(c, http.StatusInternalServerError, message, err)
}
