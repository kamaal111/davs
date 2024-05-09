package health

import (
	"path/filepath"

	"github.com/gin-gonic/gin"

	healthPing "github.com/kamaal111/davs/health/ping"
)

func Router(engine *gin.Engine, basePath string) *gin.Engine {
	group := engine.Group(filepath.Join(basePath, "health"))
	group.GET("/ping", healthPing.PingHandler)

	return engine
}
