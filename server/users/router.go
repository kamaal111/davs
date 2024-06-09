package users

import (
	"log"
	"os"

	"github.com/Kamaalio/kamaalgo/files"
	"github.com/Kamaalio/kamaalgo/strings"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func InitializeRouter(server *gin.Engine, basePath string, db *gorm.DB) {
	_, err := strings.Unwrap(os.Getenv("API_KEY"))
	if err != nil {
		log.Fatalln("API ket not found")
	}

	group := server.Group(files.AppendFileToPath(basePath, "users"))
	group.POST("/sign-up", signUpHandler(db))
	group.POST("/login", loginHandler(db))
}
