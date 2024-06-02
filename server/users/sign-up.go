package users

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	kamaalStrings "github.com/Kamaalio/kamaalgo/strings"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/crypto"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func signUpHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[signUpHeaders](context)
		if !headersAreValid {
			return
		}

		apiKey := os.Getenv("API_KEY")
		splittedHeadersToken := strings.Split(headers.Authorization, "Token ")
		if apiKey != splittedHeadersToken[len(splittedHeadersToken)-1] {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Unauthorized",
				Status:  http.StatusUnauthorized,
			})
			return
		}

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

		context.JSON(http.StatusCreated, signUpResponse{})
	}
}

type signUpResponse struct {
}

type signUpHeaders struct {
	Authorization string `header:"authorization" binding:"required,len=70" example:"Token f0071ba5740184e39e3d7bbf4f5a6e27d054458a13dc7013d93d04feb8ee8b85"`
}

type signUpPayload struct {
	Message string `json:"message" binding:"required,min=10"`
}

type decryptedSignUpPayload struct {
	Username string `json:"username" binding:"required,min=1"`
	Password string `json:"password" binding:"required,min=5"`
}
