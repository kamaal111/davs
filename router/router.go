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
)

func Start() {
	serverAddress := os.Getenv("SERVER_ADDRESS")
	if serverAddress == "" {
		port, err := strings.Unwrap(os.Getenv("PORT"))
		if err != nil {
			log.Fatal("No SERVER_ADDRESS and PORT defined in env")
		}
		serverAddress = fmt.Sprintf(":%s", port)
	}

	engine := gin.Default()
	engine.SetTrustedProxies(nil)

	basePath := "api/v1"
	docs.SwaggerInfo.BasePath = fmt.Sprintf("/%s", basePath)

	engine.NoRoute(notFound)
	engine.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	engine.Run(serverAddress)
}
