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

var errInvalidToken = errors.New("invalid authentication token provided")

type BasicLoginHeaders struct {
	Authorization string `header:"authorization" binding:"required,len=70" example:"Basic R0lGODlhAQAB"`
}

func BasicAuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[BasicLoginHeaders](context)
		if !headersAreValid {
			return
		}

		user, err := basicLogin(db)(headers.Authorization)
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
		authSplit := strings.Split(auth, "Basic ")
		if len(authSplit) != 2 {
			return nil, errInvalidToken
		}

		decodedAuth, err := base64.StdEncoding.DecodeString(authSplit[len(authSplit)-1])
		if err != nil {
			return nil, errInvalidToken
		}

		decodedAuthSplit := strings.Split(string(decodedAuth), ":")
		if len(decodedAuthSplit) != 2 {
			return nil, errInvalidToken
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
