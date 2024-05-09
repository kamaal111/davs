package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

//	@title			DAVS API
//	@version		1.0
//	@description	API for DAVS

//	@license.name	MIT
//	@license.url	https://github.com/kamaal111/davs/blob/main/LICENSE

// @BasePath	/api/v1
func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.Run()
}
