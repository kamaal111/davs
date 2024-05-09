package contacts

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Summary	Create a contact
// @Schemes
// @Description	To create a contact
// @Tags			contacts
// @ID				createContact
// @Accept			json
// @Produce		json
// @Success		200	{object}	createResponse
// @Router			/contacts [post]
func createHandler(context *gin.Context) {
	context.JSON(http.StatusOK, createResponse{})
}

type createResponse struct {
}
