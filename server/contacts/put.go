package contacts

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	"github.com/kamaal111/davs/utils"
)

func putHandler() func(context *gin.Context) {
	return func(context *gin.Context) {
		user := users.GetUserFromContext(context)
		fmt.Println(user)

		filename := context.Param("filename")
		fmt.Println(filename)

		payload, handled := utils.ValidatePayload[putPayload](context)
		if handled {
			return
		}

		log.Println(payload)
		context.JSON(http.StatusCreated, putResponse{})
	}
}

type putResponse struct {
}

type putPayload struct {
	FirstName string               `json:"first_name" binding:"required,min=1"`
	LastName  *string              `json:"last_name" binding:"min=1"`
	Nickname  *string              `json:"nickname" binding:"min=1"`
	Birthday  *string              `json:"birthday" time_format:"2006-01-02"`
	Phones    []putPayloadPhone    `json:"phones" binding:"required,min=1"`
	Addresses []*putPayloadAddress `json:"addresses"`
}

type putPayloadPhone struct {
	Number string    `json:"number" binding:"required,min=5"`
	Types  []*string `json:"types"`
}

type putPayloadAddress struct {
	Types      []*string `json:"types"`
	Street     *string   `json:"street"`
	PostalCode *string   `json:"postalCode"`
	City       *string   `json:"city"`
	Country    *string   `json:"country"`
}
