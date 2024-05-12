package users

import (
	"log"
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// @Summary	Sign up user
// @Schemes
// @Description	To create a user
//
// @Tags			users
// @ID				signUpUser
//
// @Accept			json
// @Produce		json
//
// @Param			payload	body		signUpPayload	true	"Sign up payload to create a user"
//
// @Success		200		{object}	signUpResponse
//
// @Router			/users [post]
func signUpHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		payload, handled := utils.ValidatePayload[signUpPayload](context)
		if handled {
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.MinCost)
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Failed to store password",
				Status:  http.StatusInternalServerError,
			})
			return
		}

		log.Println(hashedPassword)

		context.JSON(http.StatusCreated, signUpResponse{})
	}
}

type signUpResponse struct {
}

type signUpPayload struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=5"`
}
