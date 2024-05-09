package healthPing

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary	Checks if server is up or down
// @Schemes
// @Description	To pings the server
// @Tags			health
// @ID				healthPing
// @Accept			json
// @Produce		json
// @Success		200	{object}	pingResponse
// @Router			/health/ping [get]
func PingHandler(context *gin.Context) {
	context.JSON(http.StatusOK, pingResponse{Message: "pong"})
}

type pingResponse struct {
	Message string `json:"message"`
}
