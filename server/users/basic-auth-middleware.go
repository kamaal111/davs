package users

import (
	"encoding/base64"
	"errors"
	"net/http"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

var errInvalidBasicToken = errors.New("invalid authentication token provided")

type basicLoginHeaders struct {
	Authorization string `header:"authorization" binding:"required,len=70" example:"Basic R0lGODlhAQAB"`
}

func basicAuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[basicLoginHeaders](context)
		if !headersAreValid {
			return
		}

		authSplit := strings.Split(headers.Authorization, "Basic ")
		if len(authSplit) != 2 {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		user, err := basicLogin(db)(authSplit[1])
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		context.Set("user", *user)
		context.Next()
	}
}

func basicLogin(db *gorm.DB) func(auth string) (*User, error) {
	return func(auth string) (*User, error) {
		decodedAuth, err := base64.StdEncoding.DecodeString(auth)
		if err != nil {
			return nil, errInvalidBasicToken
		}

		decodedAuthSplit := strings.Split(string(decodedAuth), ":")
		if len(decodedAuthSplit) != 2 {
			return nil, errInvalidBasicToken
		}

		username := decodedAuthSplit[0]
		userPassword := decodedAuthSplit[1]
		user := User{Username: username}
		err = user.Login(db)(userPassword)
		if err != nil {
			return nil, errDoesNotExist
		}

		return &user, nil
	}
}
