package health

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func pingHandler(context *gin.Context) {
	context.JSON(http.StatusOK, pingResponse{Message: "pong"})
}

type pingResponse struct {
	Message string `json:"message"`
}
