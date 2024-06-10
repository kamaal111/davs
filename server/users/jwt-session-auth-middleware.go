package users

import (
	"fmt"
	"math"
	"net/http"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
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
		claims, err := verifyUserToken(tokenString)
		if err != nil {
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
