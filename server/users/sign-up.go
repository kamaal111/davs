package users

import (
	"log"
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func signUpHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		payload, handled := utils.ValidatePayload[signUpPayload](context)
		if handled {
			return
		}

		user := User{Username: payload.Username, Password: payload.Password}
		err := user.create(db)
		if err != nil {
			if err == errUserExists {
				ginErrors.ErrorHandler(context, ginErrors.Error{
					Message: "User already exists",
					Status:  http.StatusConflict,
				})
				return
			}

			if err == errInvalidUserPayload {
				ginErrors.ErrorHandler(context, ginErrors.Error{
					Message: "Invalid user payload provided",
					Status:  http.StatusBadRequest,
				})
				return
			}

			log.Printf("Failed to create the user; error=%v", err)
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Failed to create the user",
				Status:  http.StatusInternalServerError,
			})
			return
		}

		tokenString, err := signUserToken(user)
		if err != nil {
			log.Println("Token could not be signed")
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Something went wrong",
				Status:  http.StatusInternalServerError,
			})
			return
		}

		context.JSON(http.StatusCreated, signUpResponse{AuthorizationToken: tokenString})
	}
}

type signUpResponse struct {
	AuthorizationToken string `json:"authorization_token"`
}

type signUpPayload struct {
	Username string `json:"username" binding:"required,min=1"`
	Password string `json:"password" binding:"required,min=5"`
}
