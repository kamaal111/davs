package contacts

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	"gorm.io/gorm"
)

func putHandler(db *gorm.DB) func(context *gin.Context) {
	return func(context *gin.Context) {
		filename := context.Param("filename")
		if len(filename) < 5 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		fileComponents := strings.Split(filename, ".")
		if len(fileComponents) < 2 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		fileExtension := fileComponents[len(fileComponents)-1]
		if fileExtension != "vcf" {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		fileContentBytes, err := context.GetRawData()
		if err != nil {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		if len(fileContentBytes) == 0 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		user := users.GetUserFromContext(context)
		contact, _ := users.GetContactByUserIDAndName(db)(*user, filename)
		var etag string
		if contact == nil {
			createdContact := users.CreateContact(db)(*user, fileContentBytes, filename)
			etag = createdContact.GetEtag()
		} else {
			updatedContact := users.UpdateContactCard(db)(*contact, fileContentBytes)
			etag = updatedContact.GetEtag()
		}

		context.Data(http.StatusCreated, "text/plain", []byte(etag))
	}
}
