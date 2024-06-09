package users

import (
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"strings"
	"time"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	kamaalStrings "github.com/Kamaalio/kamaalgo/strings"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

type jwtSessionHeaders struct {
	Authorization string `header:"authorization" binding:"required"`
}

func jwtSessionAuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[jwtSessionHeaders](context)
		if !headersAreValid {
			return
		}

		splittedHeadersToken := strings.Split(headers.Authorization, "Bearer ")
		if len(splittedHeadersToken) != 2 {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		tokenString := splittedHeadersToken[len(splittedHeadersToken)-1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			_, ok := token.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				algorithm := token.Header["alg"]
				log.Printf("Unexpected signing method: %v", algorithm)
				return nil, fmt.Errorf("unexpected signing method: %v", algorithm)
			}

			jwtSecret, err := kamaalStrings.Unwrap(os.Getenv("JWT_SECRET"))
			if err != nil {
				log.Println("JWT_SECRET not defined in .env")
				ginErrors.ErrorHandler(context, ginErrors.Error{
					Message: "Something went wrong",
					Status:  http.StatusInternalServerError,
				})
				return nil, err
			}

			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		userID, ok := claims["sub"].(float64)
		if !ok {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		parsedUserID := fmt.Sprintf("%v", int(math.Round(userID)))
		user := getUserByID(db)(parsedUserID)
		if user == nil {
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
