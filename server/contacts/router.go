package contacts

import (
	"github.com/Kamaalio/kamaalgo/files"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	"gorm.io/gorm"
)

func InitializeRouter(server *gin.Engine, basePath string, db *gorm.DB) {
	group := server.Group(files.AppendFileToPath(basePath, "contacts"))

	group.Use(users.BasicOrJWTAuthMiddleware(db))

	group.PUT("/:filename", putHandler())
}
