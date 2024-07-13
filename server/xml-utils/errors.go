package xmlutils

import (
	"encoding/xml"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func AbortWithMultiStatusXML(context *gin.Context) func(code int, message string) {
	return func(code int, message string) {
		errorResponse := MultiStatusXML{
			XMLNS: "DAV:",
			Response: []MultiStatusXMLResponse{{Propstat: MultiStatusXMLPropstat{
				Status: fmt.Sprintf("HTTP/1.1 %d %s", code, message),
			},
			}},
		}
		marshalledResponse, err := xml.MarshalIndent(errorResponse, "", " ")
		if err != nil {
			log.Fatalln("Could not marshal error response")
		}

		context.Data(code, "application/xml; charset=utf-8", marshalledResponse)
		context.Abort()
	}
}
