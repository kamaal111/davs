package discovery

import (
	"encoding/xml"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	xmlutils "github.com/kamaal111/davs/xml-utils"
)

func rootPropfindHandler() func(context *gin.Context) {
	return func(context *gin.Context) {
		var payload rootPropfindPayload
		err := context.ShouldBindBodyWithXML(&payload)
		if err != nil {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusBadRequest, "Bad Request")
			return
		}

		if payload.XMLNS != "DAV:" {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusNotFound, "Not Found")
			return
		}

		user := users.GetUserFromContext(context)
		response, err := makeRootPropfindResponse(payload, *user)
		if err != nil {
			log.Println("Could not marshal response; error:", err)
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusInternalServerError, "Internal Server Error")
			return
		}

		context.Data(http.StatusMultiStatus, PROPFIND_CONTENT_TYPE, response)
	}
}

func makeRootPropfindResponse(payload rootPropfindPayload, user users.User) ([]byte, error) {
	response := rootPropfindResponse{
		Response: rootPropfindResponseResponse{Propstat: rootPropfindResponseResponsePropstat{
			Prop:   []rootPropfindResponseResponsePropstatProp{},
			Status: fmt.Sprintf("HTTP/1.1 %d %s", http.StatusOK, "OK"),
		}},
	}
	requestingCurrentUserPrinciple := payload.Prop.CurrentUserPrincipal != nil
	if requestingCurrentUserPrinciple {
		response.Response.Propstat.Prop = append(
			response.Response.Propstat.Prop,
			rootPropfindResponseResponsePropstatProp{
				CurrentUserPrincipal: rootPropfindResponseResponsePropstatPropCurrentUserPrincipal{
					HREF: user.UsersPrincipals(),
				},
			})
	}

	marshalledResponse, err := xml.MarshalIndent(response, "", " ")
	if err != nil {
		return nil, err
	}

	responseAsString := strings.Replace(
		string(marshalledResponse),
		"<d:multistatus xmlns:d=\"\">",
		"<d:multistatus xmlns:d=\"DAV:\">",
		1,
	)

	return []byte(responseAsString), nil
}

type rootPropfindResponse struct {
	xmlutils.MultiStatusXML
	Response rootPropfindResponseResponse `xml:"d:response"`
}

type rootPropfindResponseResponse struct {
	Propstat rootPropfindResponseResponsePropstat `xml:"d:propstat"`
}

type rootPropfindResponseResponsePropstat struct {
	xmlutils.MultiStatusXMLPropstat
	Status string                                     `xml:"d:status"`
	Prop   []rootPropfindResponseResponsePropstatProp `xml:"d:prop"`
}

type rootPropfindResponseResponsePropstatProp struct {
	CurrentUserPrincipal rootPropfindResponseResponsePropstatPropCurrentUserPrincipal `xml:"d:current-user-principal,omitempty"`
}

type rootPropfindResponseResponsePropstatPropCurrentUserPrincipal struct {
	HREF string `xml:"d:href"`
}

type rootPropfindPayload struct {
	XMLName xml.Name                `xml:"propfind"`
	XMLNS   string                  `xml:"d,attr"`
	Prop    rootPropfindPayloadProp `xml:"prop"`
}

type rootPropfindPayloadProp struct {
	CurrentUserPrincipal *xml.Name `xml:"current-user-principal"`
}
