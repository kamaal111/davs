package contacts

import (
	"github.com/Kamaalio/kamaalgo/files"
	"github.com/gin-gonic/gin"
)

func InitializeRouter(server *gin.Engine, basePath string) {
	group := server.Group(files.AppendFileToPath(basePath, "contacts"))
	group.POST("/", createHandler())
}
