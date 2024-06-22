package contacts

import "github.com/gin-gonic/gin"

func vCardContentTypeMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Writer.Header().Set("Content-Type", "text/vcard")
		context.Next()
	}
}
