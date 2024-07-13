package discovery

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func userPrincipalsPropfind() gin.HandlerFunc {
	return func(context *gin.Context) {
		context.Data(http.StatusMultiStatus, PROPFIND_CONTENT_TYPE, []byte("Hello"))
	}
}
