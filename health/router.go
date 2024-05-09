package health

import (
	"github.com/Kamaalio/kamaalgo/files"
	"github.com/gin-gonic/gin"

	healthPing "github.com/kamaal111/davs/health/ping"
)

func InitializeRouter(server *gin.Engine, basePath string) {
	group := server.Group(files.AppendFileToPath(basePath, "health"))
	group.GET("/ping", healthPing.PingHandler)
}
