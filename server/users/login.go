package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func loginHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		context.JSON(http.StatusOK, loginResponse{Details: "Created"})
	}
}

type loginResponse struct {
	Details string `json:"details"`
}
