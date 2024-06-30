package contacts

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	"gorm.io/gorm"
)

func putHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		params, valid := validatePutHandlerParams(context)
		if !valid {
			return
		}

		payload, valid := validatePutHandlerPayload(context)
		if !valid {
			return
		}

		user := users.GetUserFromContext(context)
		contact, err := users.CreateOrUpdateContactCard(db)(*user, params.Filename)(payload.Content)
		if err != nil {
			log.Println("Failed to create or update contact card", err)
			context.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		responseContentType := "text/plain"
		context.Writer.Header().Set("Content-Type", responseContentType)
		context.Data(http.StatusCreated, responseContentType, []byte(contact.GetEtag()))
	}
}

type putHandlerPayload struct {
	Content []byte
}

func validatePutHandlerPayload(context *gin.Context) (*putHandlerPayload, bool) {
	fileContentBytes, err := context.GetRawData()
	if err != nil {
		context.AbortWithStatus(http.StatusBadRequest)
		return nil, false
	}

	if len(fileContentBytes) == 0 {
		context.AbortWithStatus(http.StatusBadRequest)
		return nil, false
	}

	return &putHandlerPayload{Content: fileContentBytes}, true
}

type putHandlerParams struct {
	Filename string
}

func validatePutHandlerParams(context *gin.Context) (*putHandlerParams, bool) {
	filename := context.Param("filename")
	if len(filename) < 5 {
		context.AbortWithStatus(http.StatusBadRequest)
		return nil, false
	}

	fileComponents := strings.Split(filename, ".")
	if len(fileComponents) < 2 {
		context.AbortWithStatus(http.StatusBadRequest)
		return nil, false
	}

	fileExtension := fileComponents[len(fileComponents)-1]
	if fileExtension != "vcf" {
		context.AbortWithStatus(http.StatusBadRequest)
		return nil, false
	}

	return &putHandlerParams{Filename: filename}, true
}
