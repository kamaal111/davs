package users

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/utils"
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
func signUpHandler() func(context *gin.Context) {
	return func(context *gin.Context) {
		payload, handled := utils.ValidatePayload[signUpPayload](context)
		if handled {
			return
		}

		log.Println(payload)

		context.JSON(http.StatusCreated, signUpResponse{})
	}
}

type signUpResponse struct {
}

type signUpPayload struct {
}
