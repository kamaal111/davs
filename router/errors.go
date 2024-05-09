package router

import (
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
)

func notFound(context *gin.Context) {
	ginErrors.ErrorHandler(context, ginErrors.Error{Status: http.StatusNotFound, Message: "Not found"})
}
