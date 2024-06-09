package router

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/contacts"
	"github.com/kamaal111/davs/health"
	"github.com/kamaal111/davs/users"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

const DEFAULT_PORT = "8000"

func Start(db *gorm.DB) {
	serverAddress := getServerAddress()
	server := initializeServer()
	basePath := "api/v1"
	initializeRoutes(server, basePath, db)
	server.Run(serverAddress)
}

func initializeServer() *gin.Engine {
	engine := gin.Default()
	engine.SetTrustedProxies(nil)

	return engine
}

func initializeRoutes(server *gin.Engine, basePath string, db *gorm.DB) {
	health.InitializeRouter(server, basePath)
	contacts.InitializeRouter(server, basePath, db)
	users.InitializeRouter(server, basePath, db)
	server.NoRoute(notFound)
}

func getServerAddress() string {
	environment := utils.GetEnvironment()
	if environment.ServerAddress != "" {
		return environment.ServerAddress
	}

	port := environment.Port
	if port == "" {
		if environment.IsReleaseMode {
			log.Fatalln("PORT or SERVER_ADDRESS is undefined")
		}

		port = DEFAULT_PORT
	}

	return fmt.Sprintf(":%s", port)
}
