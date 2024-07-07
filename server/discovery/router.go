package discovery

import (
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func InitializeRouter(server *gin.Engine, db *gorm.DB) {
	group := server.Group("")

	group.Use(users.BasicOrJWTAuthMiddleware(db), utils.ContentTypeEnforcementMiddleware("application/xml"))

	group.Handle("PROPFIND", "/", rootPropfindHandler())
	group.Handle("PROPFIND", "/principals/users/:username", userPrincipalsPropfind())
}
