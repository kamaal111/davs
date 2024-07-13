package discovery

import (
	"encoding/xml"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	xmlutils "github.com/kamaal111/davs/xml-utils"
)

func rootPropfindHandler() gin.HandlerFunc {
	return func(context *gin.Context) {
		payload, payloadIsValid := xmlutils.ValidatePayload[rootPropfindPayload](context)
		if !payloadIsValid {
			return
		}

		if payload.XMLNS != "DAV:" {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusNotFound, "Not Found")
			return
		}

		user := users.GetUserFromContext(context)
		response, err := makeRootPropfindResponse(*payload, *user)
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
		XMLNS: payload.XMLNS,
		Response: rootPropfindResponseResponse{
			HREF: "/",
			Propstat: rootPropfindResponseResponsePropstat{
				Prop:   []rootPropfindResponseResponsePropstatProp{},
				Status: fmt.Sprintf("HTTP/1.1 %d %s", http.StatusOK, "OK"),
			},
		},
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

	return marshalledResponse, nil
}

type rootPropfindResponse struct {
	xmlutils.MultiStatusXML
	XMLNS    string                       `xml:"xmlns:d,attr"`
	Response rootPropfindResponseResponse `xml:"d:response"`
}

type rootPropfindResponseResponse struct {
	HREF     string                               `xml:"d:href"`
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
