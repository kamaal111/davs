package users

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/kamaal111/davs/crypto"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

func loginHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		payload, handled := utils.ValidatePayload[loginPayload](context)
		if handled {
			return
		}

		environment := utils.GetEnvironment()
		decryptedPayload, err := crypto.AESDecrypt([]byte(environment.EncryptionSecretKey), []byte(payload.Message))
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid body provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		var decryptedPayloadJSON decryptedLoginPayload
		err = json.Unmarshal(decryptedPayload, &decryptedPayloadJSON)
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid body provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		user := User{Username: decryptedPayloadJSON.Username, Password: decryptedPayloadJSON.Password}
		err = user.Login(db)(decryptedPayloadJSON.Password)
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"sub": user.ID,
			// Valid for 30 days
			"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
		})
		tokenString, err := token.SignedString([]byte(environment.JWTSecret))
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
	Message string `json:"message" binding:"required,min=10"`
}

type decryptedLoginPayload struct {
	Username string `json:"username" binding:"required,min=1"`
	Password string `json:"password" binding:"required,min=5"`
}

type loginResponse struct {
	AuthorizationToken string `json:"authorization_token"`
}
