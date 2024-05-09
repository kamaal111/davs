package router

import (
	"fmt"
	"log"
	"os"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/Kamaalio/kamaalgo/strings"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/docs"
	"github.com/kamaal111/davs/health"
)

func Start() {
	serverAddress := getServerAddress()
	server := initializeServer()
	basePath := "api/v1"
	updateSwaggerInfo(swaggerInfo{basePath: basePath})
	initializeRoutes(server, basePath)
	server.Run(serverAddress)
}

func initializeServer() *gin.Engine {
	engine := gin.Default()
	engine.SetTrustedProxies(nil)

	return engine
}

func initializeRoutes(server *gin.Engine, basePath string) {
	health.InitializeRouter(server, basePath)
	server.NoRoute(notFound)
	server.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
}

func getServerAddress() string {
	serverAddress := os.Getenv("SERVER_ADDRESS")
	if serverAddress == "" {
		port, err := strings.Unwrap(os.Getenv("PORT"))
		if err != nil {
			log.Fatal("No SERVER_ADDRESS and PORT defined in env")
		}

		return fmt.Sprintf(":%s", port)
	}

	return serverAddress
}

type swaggerInfo struct {
	basePath string
}

func updateSwaggerInfo(info swaggerInfo) {
	docs.SwaggerInfo.BasePath = fmt.Sprintf("/%s", info.basePath)
}
