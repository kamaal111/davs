package users

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func sessionHandler() func(context *gin.Context) {
	return func(context *gin.Context) {
		user := GetUserFromContext(context)
		context.JSON(http.StatusOK, sessionResponse{Username: user.Username})
	}
}

type sessionResponse struct {
	Username string `json:"username"`
}
