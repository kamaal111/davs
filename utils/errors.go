package utils

import (
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
)

func ValidatePayload[Payload any](context *gin.Context) (*Payload, bool) {
	var payload Payload
	err := context.ShouldBindJSON(&payload)
	if err != nil {
		handled := ginErrors.HandleValidationErrors(context, err, "body")
		if handled {
			return nil, true
		}

		ginErrors.ErrorHandler(context, ginErrors.Error{
			Status:  http.StatusBadRequest,
			Message: "Invalid body provided",
		})
		return nil, true
	}

	return &payload, false
}
