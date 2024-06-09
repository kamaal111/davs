package users

import (
	"github.com/Kamaalio/kamaalgo/files"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitializeRouter(server *gin.Engine, basePath string, db *gorm.DB) {
	group := server.Group(files.AppendFileToPath(basePath, "users"))

	group.POST("/sign-up", apiKeyAuthMiddleware(), signUpHandler(db))
	group.POST("/login", loginHandler(db))
	group.GET("/session", jwtSessionAuthMiddleware(db), sessionHandler())
}
