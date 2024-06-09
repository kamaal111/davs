package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func sessionHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		context.JSON(http.StatusOK, sessionResponse{})
	}
}

type sessionResponse struct {
}
