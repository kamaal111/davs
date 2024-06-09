package users

import (
	"net/http"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
)

type apiKeyAuthHeaders struct {
	Authorization string `header:"authorization" binding:"required,len=70" example:"Token f0071ba5740184e39e3d7bbf4f5a6e27d054458a13dc7013d93d04feb8ee8b85"`
}

func apiKeyAuthMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[apiKeyAuthHeaders](context)
		if !headersAreValid {
			return
		}

		environment := utils.GetEnvironment()
		splittedHeadersToken := strings.Split(headers.Authorization, "Token ")
		if environment.APIKey != splittedHeadersToken[len(splittedHeadersToken)-1] {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Unauthorized",
				Status:  http.StatusUnauthorized,
			})
			return
		}

		context.Next()
	}
}
