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

func (c *UserController) GetUsers(ctx *gin.Context) {
	page, limit := c.GetPageAndLimitFromQuery(ctx)

	users, total, err := c.userService.GetAllUsers(ctx.Request.Context(), page, limit)
	if err != nil {
		utils.InternalServerError(ctx, "Failed to get users", err)
		return
	}

	c.SendPaginationResponse(ctx, users, total, page, limit)
}

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
