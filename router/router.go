package router

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/contacts"
	"github.com/kamaal111/davs/docs"
	"github.com/kamaal111/davs/health"
	"github.com/kamaal111/davs/users"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"gorm.io/gorm"
)

const DEFAULT_PORT = "8000"

func Start(db *gorm.DB) {
	serverAddress := getServerAddress()
	server := initializeServer()
	basePath := "api/v1"
	updateSwaggerInfo(swaggerInfo{basePath: basePath})
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
	contacts.InitializeRouter(server, basePath)
	users.InitializeRouter(server, basePath, db)
	server.NoRoute(notFound)
	server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func getServerAddress() string {
	serverAddress := os.Getenv("SERVER_ADDRESS")
	if serverAddress != "" {
		return serverAddress
	}

	port := os.Getenv("PORT")
	if port == "" {
		if os.Getenv("GIN_MODE") == "release" {
			log.Fatalln("PORT or SERVER_ADDRESS is undefined")
		}

		port = DEFAULT_PORT
	}

	return fmt.Sprintf(":%s", port)
}

type swaggerInfo struct {
	basePath string
}

func updateSwaggerInfo(info swaggerInfo) {
	docs.SwaggerInfo.BasePath = fmt.Sprintf("/%s", info.basePath)
}
