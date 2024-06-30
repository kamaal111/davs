package contacts

import (
	"net/http"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
)

func contentTypeEnforcementMiddleware(contentType string) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, valid := utils.ValidateHeaders[contentTypeEnforcementHeaders](context)
		if !valid {
			return
		}

		contentTypeComponents := strings.Split(headers.ContentType, contentType)
		if len(contentTypeComponents) < 1 {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid headers provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		requestContentType := contentTypeComponents[0]
		if contentType == requestContentType {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid headers provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		context.Next()
	}
}

type contentTypeEnforcementHeaders struct {
	ContentType string `header:"content-type" binding:"required"`
}
