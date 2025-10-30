package controller

import (
	"orchid_be/internal/service"
	"orchid_be/internal/utils"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	*BaseController
	userService service.UserService
}

func NewUserController(userService service.UserService) *UserController {
	return &UserController{
		BaseController: NewBaseController(),
		userService:    userService,
	}
}

// GetUsers godoc
// @Summary Get all users
// @Description Get paginated list of users
// @Tags users
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} utils.Response
// @Failure 500 {object} utils.Response
// @Router /api/users [get]
func (c *UserController) GetUsers(ctx *gin.Context) {
	page, limit := c.GetPageAndLimitFromQuery(ctx)

	users, total, err := c.userService.GetAllUsers(ctx.Request.Context(), page, limit)
	if err != nil {
		utils.InternalServerError(ctx, "Failed to get users", err)
		return
	}

	c.SendPaginationResponse(ctx, users, total, page, limit)
}

// GetUserByID godoc
// @Summary Get user by ID
// @Description Get a single user by their ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /api/users/{id} [get]
func (c *UserController) GetUserByID(ctx *gin.Context) {
	id, err := c.GetIDFromURL(ctx)
	if err != nil {
		utils.BadRequest(ctx, "Invalid user ID", err)
		return
	}

	user, err := c.userService.GetUserByID(ctx.Request.Context(), id)
	if err != nil {
		utils.NotFound(ctx, "User not found", err)
		return
	}

	utils.Success(ctx, "User retrieved successfully", user)
}

// CreateUser godoc
// @Summary Create new user
// @Description Create a new user with name, email and password
// @Tags users
// @Accept json
// @Produce json
// @Param user body service.CreateUserRequest true "User data"
// @Success 201 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Router /api/users [post]
func (c *UserController) CreateUser(ctx *gin.Context) {
	var req service.CreateUserRequest

	if err := c.BindJSON(ctx, &req); err != nil {
		utils.BadRequest(ctx, "Invalid request body", err)
		return
	}

	user, err := c.userService.CreateUser(ctx.Request.Context(), &req)
	if err != nil {
		utils.BadRequest(ctx, "Failed to create user", err)
		return
	}

	utils.Created(ctx, "User created successfully", user)
}

// UpdateUser godoc
// @Summary Update user
// @Description Update user information by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Param user body service.UpdateUserRequest true "User data"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /api/users/{id} [put]
func (c *UserController) UpdateUser(ctx *gin.Context) {
	id, err := c.GetIDFromURL(ctx)
	if err != nil {
		utils.BadRequest(ctx, "Invalid user ID", err)
		return
	}

	var req service.UpdateUserRequest
	if err := c.BindJSON(ctx, &req); err != nil {
		utils.BadRequest(ctx, "Invalid request body", err)
		return
	}

	user, err := c.userService.UpdateUser(ctx.Request.Context(), id, &req)
	if err != nil {
		utils.BadRequest(ctx, "Failed to update user", err)
		return
	}

	utils.Success(ctx, "User updated successfully", user)
}

// DeleteUser godoc
// @Summary Delete user
// @Description Delete a user by ID
// @Tags users
// @Accept json
// @Produce json
// @Param id path int true "User ID"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.Response
// @Failure 404 {object} utils.Response
// @Router /api/users/{id} [delete]
func (c *UserController) DeleteUser(ctx *gin.Context) {
	id, err := c.GetIDFromURL(ctx)
	if err != nil {
		utils.BadRequest(ctx, "Invalid user ID", err)
		return
	}

	if err := c.userService.DeleteUser(ctx.Request.Context(), id); err != nil {
		utils.NotFound(ctx, "User not found", err)
		return
	}

	utils.Success(ctx, "User deleted successfully", gin.H{
		"id": id,
	})
}

func (c *UserController) SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		users := api.Group("/users")
		{
			users.GET("", c.GetUsers)
			users.GET("/:id", c.GetUserByID)
			users.POST("", c.CreateUser)
			users.PUT("/:id", c.UpdateUser)
			users.DELETE("/:id", c.DeleteUser)
		}
	}
}
