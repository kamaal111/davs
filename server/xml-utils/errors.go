package xmlutils

import (
	"encoding/xml"
	"fmt"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
)

func AbortWithMultiStatusXML(context *gin.Context) func(code int, message string) {
	return func(code int, message string) {
		errorResponse := MultiStatusXML{
			Response: []MultiStatusXMLResponse{{Propstat: MultiStatusXMLPropstat{
				Status: fmt.Sprintf("HTTP/1.1 %d %s", code, message),
			},
			}},
		}
		marshalledResponse, err := xml.MarshalIndent(errorResponse, "", " ")
		if err != nil {
			log.Fatalln("Could not marshal error response")
		}

		responseAsString := strings.Replace(
			string(marshalledResponse),
			"<d:multistatus xmlns:d=\"\">",
			"<d:multistatus xmlns:d=\"DAV:\">",
			1,
		)

		context.Data(code, "application/xml; charset=utf-8", []byte(responseAsString))
	}
}
