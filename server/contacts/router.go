package contacts

import (
	"github.com/Kamaalio/kamaalgo/files"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func InitializeRouter(server *gin.Engine, basePath string, db *gorm.DB) {
	group := server.Group(files.AppendFileToPath(basePath, "contacts"))

	group.Use(users.BasicOrJWTAuthMiddleware(db))

	group.PUT("/:address_book/:filename", utils.ContentTypeEnforcementMiddleware("text/vcard"), putHandler(db))
}
