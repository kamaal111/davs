package xmlutils

import (
	"encoding/xml"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidatePayload[Payload any](context *gin.Context) (*Payload, bool) {
	var payload Payload
	err := context.ShouldBindBodyWithXML(&payload)
	if err != nil {
		AbortWithMultiStatusXML(context)(http.StatusBadRequest, "Bad Request")
		return nil, false
	}

	return &payload, true
}

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
