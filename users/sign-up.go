package users

import (
	"log"
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
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
// @Param			payload	header		signUpHeaders	true	"Sign up headers"
//
// @Success		200		{object}	signUpResponse
//
// @Router			/users [post]
func signUpHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		var headers signUpHeaders
		err := context.ShouldBindHeader(&headers)
		if err != nil {
			ginErrors.ErrorHandler(context, ginErrors.Error{
				Message: "Invalid headers provided",
				Status:  http.StatusBadRequest,
			})
			return
		}

		payload, handled := utils.ValidatePayload[signUpPayload](context)
		if handled {
			return
		}

		err = createUser(db)(User{Username: payload.Username, Password: payload.Password})
		if err != nil {
			if err == errUserExists {
				ginErrors.ErrorHandler(context, ginErrors.Error{
					Message: "User already exists",
					Status:  http.StatusConflict,
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
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=5"`
}
