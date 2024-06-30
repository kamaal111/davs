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
		addressBook, err := users.GetOrCreateAddressBook(db)(*user, params.AddressBook)
		if err == users.ErrAddressBookNameIsTooShort {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		} else if err != nil {
			log.Println("Failed to get or create address book", err)
			context.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		contact, created, err := users.CreateOrUpdateContactCard(db)(*addressBook, params.Filename)(payload.Content)
		if err != nil {
			log.Println("Failed to create or update contact card", err)
			context.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var statusCode int
		if created {
			statusCode = http.StatusCreated
		} else {
			statusCode = http.StatusOK
		}

		responseContentType := "text/plain"
		context.Writer.Header().Set("Content-Type", responseContentType)
		context.Data(statusCode, responseContentType, []byte(contact.GetEtag()))
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
	AddressBook string
	Filename    string
}

func validatePutHandlerParams(context *gin.Context) (*putHandlerParams, bool) {
	addressBook := context.Param("address_book")
	if len(addressBook) < 1 {
		context.AbortWithStatus(http.StatusBadRequest)
		return nil, false
	}

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

	return &putHandlerParams{AddressBook: addressBook, Filename: filename}, true
}
