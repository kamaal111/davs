package users

import (
	"net/http"
	"strings"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

type BasicOrJWTHeaders struct {
	Authorization string `header:"authorization" binding:"required"`
}

func BasicOrJWTAuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[BasicOrJWTHeaders](context)
		if !headersAreValid {
			return
		}

		splittedToken := strings.Split(headers.Authorization, " ")
		if len(splittedToken) != 2 {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Forbidden",
				Status:  http.StatusForbidden,
			})
			return
		}

		authenticationMethod := splittedToken[0]
		token := splittedToken[1]
		if authenticationMethod == "Basic" {
			user, err := basicLogin(db)(token)
			if err != nil {
				ginErrors.ErrorHandler(context, ginErrors.Error{
					Message: "Forbidden",
					Status:  http.StatusForbidden,
				})
				return
			}

			context.Set("user", *user)
			context.Next()
			return
		}

		if authenticationMethod == "Bearer" {
			user, err := jwtLogin(db)(token)
			if err != nil {
				ginErrors.ErrorHandler(context, ginErrors.Error{
					Message: "Forbidden",
					Status:  http.StatusForbidden,
				})
				return
			}

			context.Set("user", *user)
			context.Next()
			return
		}

		ginErrors.ErrorHandler(context, ginErrors.Error{
			Message: "Forbidden",
			Status:  http.StatusForbidden,
		})
	}
}
