package utils

import (
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
)

func ValidateHeaders[Headers any](context *gin.Context) (*Headers, bool) {
	var headers Headers
	err := context.ShouldBindHeader(&headers)
	if err != nil {
		ginErrors.ErrorHandler(context, ginErrors.Error{
			Message: "Invalid headers provided",
			Status:  http.StatusBadRequest,
		})
		return nil, false
	}

	return &headers, true
}

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
