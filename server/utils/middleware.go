package utils

import (
	"errors"
	"net/http"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	xmlutils "github.com/kamaal111/davs/xml-utils"
)

const XML_CONTENT_TYPE = "application/xml"

var errNoContentType = errors.New("no content-type set")
var errInvalidContentType = errors.New("invalid content-type")

func ContentTypeEnforcementMiddleware(enforcedContentType string) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, valid := ValidateHeaders[contentTypeEnforcementHeaders](context)
		if !valid {
			return
		}

		if enforcedContentType == XML_CONTENT_TYPE {
			xmlContentTypeEnforcement(context)(*headers)
			return
		}

		defaultContentTypeEnforcement(context)(*headers, enforcedContentType)
	}
}

func defaultContentTypeEnforcement(context *gin.Context) func(headers contentTypeEnforcementHeaders, enforcedContentType string) {
	return func(headers contentTypeEnforcementHeaders, enforcedContentType string) {
		err := validateContentTypeHeader(headers, enforcedContentType)
		if err == errNoContentType {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid headers provided",
				Status:  http.StatusBadRequest,
			})
			return
		}
		if err == errInvalidContentType {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid headers provided",
				Status:  http.StatusBadRequest,
			})
			return
		}
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Internal server error",
				Status:  http.StatusInternalServerError,
			})
			return
		}

		context.Next()
	}
}

func xmlContentTypeEnforcement(context *gin.Context) func(headers contentTypeEnforcementHeaders) {
	return func(headers contentTypeEnforcementHeaders) {
		err := validateContentTypeHeader(headers, XML_CONTENT_TYPE)
		if err == errNoContentType {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusBadRequest, "Invalid headers provided")
			return
		}
		if err == errInvalidContentType {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusBadRequest, "Invalid headers provided")
			return
		}
		if err != nil {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusInternalServerError, "Internal server error")
			return
		}

		context.Next()
	}
}

func validateContentTypeHeader(headers contentTypeEnforcementHeaders, enforcedContentType string) error {
	contentTypeComponents := strings.Split(headers.ContentType, ";")
	if len(contentTypeComponents) < 1 {
		return errNoContentType
	}

	requestContentType := strings.TrimSpace(contentTypeComponents[0])
	if requestContentType != enforcedContentType {
		return errInvalidContentType
	}

	return nil
}

type contentTypeEnforcementHeaders struct {
	ContentType string `header:"content-type" binding:"required"`
}
