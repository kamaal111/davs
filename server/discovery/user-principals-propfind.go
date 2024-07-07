package discovery

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func userPrincipalsPropfind() func(context *gin.Context) {
	return func(context *gin.Context) {
		context.Data(http.StatusMultiStatus, PROPFIND_CONTENT_TYPE, []byte("Hello"))
	}
}
