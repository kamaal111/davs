package contacts

import (
	"log"
	"net/http"

	ginErrors "github.com/Kamaalio/kamaalgo/gin/errors"
	"github.com/gin-gonic/gin"
)

// @Summary	Create a contact
// @Schemes
// @Description	To create a contact
//
// @Tags			contacts
// @ID				createContact
//
// @Accept			json
// @Produce		json
//
// @Param			payload	body		createPayload	true	"Contact information used to create a contact"
//
// @Success		200		{object}	createResponse
//
// @Router			/contacts [post]
func createHandler() func(context *gin.Context) {
	return func(context *gin.Context) {
		var payload createPayload
		err := context.ShouldBindJSON(&payload)
		if err != nil {
			handled := ginErrors.HandleValidationErrors(context, err, "body")
			if handled {
				return
			}

			ginErrors.ErrorHandler(context, ginErrors.Error{
				Status:  http.StatusBadRequest,
				Message: "Invalid body provided",
			})
			return
		}

		log.Println(payload)

		context.JSON(http.StatusOK, createResponse{})
	}
}

type createResponse struct {
}

type createPayload struct {
	FirstName string                  `json:"first_name" binding:"required,min=1" example:"Kamaal"`
	LastName  *string                 `json:"last_name" binding:"min=1" extensions:"x-nullable" example:"Appledoe"`
	Nickname  *string                 `json:"nickname" binding:"min=1" extensions:"x-nullable" example:"K"`
	Birthday  *string                 `json:"birthday" time_format:"2006-01-02" extensions:"x-nullable" example:"1990-10-12"`
	Phones    []createPayloadPhone    `json:"phones" binding:"required,min=1"`
	Addresses []*createPayloadAddress `json:"addresses"`
}

type createPayloadPhone struct {
	Number string    `json:"number" binding:"required,min=5" example:"+31611111111"`
	Types  []*string `json:"types" example:"VOICE"`
}

type createPayloadAddress struct {
	Types      []*string `json:"types"`
	Street     *string   `json:"street"`
	PostalCode *string   `json:"postalCode"`
	City       *string   `json:"city"`
	Country    *string   `json:"country"`
}
