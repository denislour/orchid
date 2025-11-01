package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BaseController struct{}

func NewBaseController() *BaseController {
	return &BaseController{}
}

func (c *BaseController) GetIDFromURL(ctx *gin.Context) (int, error) {
	idStr := ctx.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (c *BaseController) GetPageAndLimitFromQuery(ctx *gin.Context) (int, int) {
	page := 1
	limit := 10

	if pageStr := ctx.Query("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	if limitStr := ctx.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	return page, limit
}

func (c *BaseController) BindJSON(ctx *gin.Context, obj interface{}) error {
	return ctx.ShouldBindJSON(obj)
}

func (c *BaseController) SendPaginationResponse(ctx *gin.Context, data interface{}, total, page, limit int) {
	ctx.JSON(http.StatusOK, gin.H{
		"data":   data,
		"total":  total,
		"page":   page,
		"limit":  limit,
	})
}
