package users

import (
	"log"
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func loginHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		payload, handled := utils.ValidatePayload[loginPayload](context)
		if handled {
			return
		}

		user := User{Username: payload.Username, Password: payload.Password}
		loggedInUser, err := user.Login(db)(payload.Password)
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		tokenString, err := signUserToken(*loggedInUser)
		if err != nil {
			log.Println("Token could not be signed")
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Something went wrong",
				Status:  http.StatusInternalServerError,
			})
			return
		}

		context.JSON(http.StatusOK, loginResponse{AuthorizationToken: tokenString})
	}
}

type loginPayload struct {
	Username string `json:"username" binding:"required,min=1"`
	Password string `json:"password" binding:"required,min=5"`
}

type loginResponse struct {
	AuthorizationToken string `json:"authorization_token"`
}
