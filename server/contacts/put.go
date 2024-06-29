package contacts

import (
	"fmt"
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

		fileContent := string(fileContentBytes)
		if len(fileContent) == 0 {
			context.AbortWithStatus(http.StatusBadRequest)
			return
		}

		user := users.GetUserFromContext(context)
		contact, _ := users.GetContactByUserIDAndName(db)(*user, filename)
		var etag string
		if contact == nil {
			createdContact := users.CreateContact(db)(*user, fileContent, filename)
			etag = fmt.Sprintf("%d-%d", createdContact.ID, createdContact.UpdatedAt.Unix())
		} else {
			// TODO: Handle update
			context.AbortWithStatus(http.StatusNotFound)
			return
		}

		fmt.Println(contact)

		context.Data(http.StatusCreated, "text/plain", []byte(etag))
	}
}
