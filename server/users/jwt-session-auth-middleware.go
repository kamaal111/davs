package users

import (
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
	"gorm.io/gorm"
)

type jwtSessionHeaders struct {
	Authorization string `header:"authorization" binding:"required"`
}

func jwtSessionAuthMiddleware(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		headers, headersAreValid := utils.ValidateHeaders[BasicLoginHeaders](context)
		if !headersAreValid {
			return
		}

		jwtSessionLogin(db)(headers.Authorization)
	}
}

func jwtSessionLogin(db *gorm.DB) func(auth string) (*User, error) {
	return func(auth string) (*User, error) {
		// splittedHeadersToken := strings.Split(headers.Authorization, "Token ")
		return nil, nil
	}
}
