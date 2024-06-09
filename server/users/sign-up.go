package users

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	kamaalStrings "github.com/Kamaalio/kamaalgo/strings"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/crypto"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func signUpHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		payload, handled := utils.ValidatePayload[signUpPayload](context)
		if handled {
			return
		}

		encryptionKey, err := kamaalStrings.Unwrap(os.Getenv("ENCRYPTION_SECRET_KEY"))
		if err != nil {
			log.Printf("Failed to get encryption key; error=%v", err)
			ginErrors.ErrorHandler(context, ginErrors.Error{Message: "Something went wrong", Status: http.StatusInternalServerError})
			return
		}

		decryptedPayload, err := crypto.AESDecrypt([]byte(encryptionKey), []byte(payload.Message))
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid body provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		var decryptedPayloadJSON decryptedSignUpPayload
		err = json.Unmarshal(decryptedPayload, &decryptedPayloadJSON)
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid body provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		user := User{Username: decryptedPayloadJSON.Username, Password: decryptedPayloadJSON.Password}
		err = user.create(db)
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

		context.JSON(http.StatusCreated, signUpResponse{Details: "Created"})
	}
}

type signUpResponse struct {
	Details string `json:"details"`
}

type signUpPayload struct {
	Message string `json:"message" binding:"required,min=10"`
}

type decryptedSignUpPayload struct {
	Username string `json:"username" binding:"required,min=1"`
	Password string `json:"password" binding:"required,min=5"`
}
