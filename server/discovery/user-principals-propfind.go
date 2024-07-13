package discovery

import (
	"encoding/xml"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kamaal111/davs/users"
	xmlutils "github.com/kamaal111/davs/xml-utils"
	"gorm.io/gorm"
)

var errAddressBookNotFoundForPropfind = errors.New("address book not found for propfind")

func userPrincipalsPropfind(db *gorm.DB) gin.HandlerFunc {
	return func(context *gin.Context) {
		payload, payloadIsValid := xmlutils.ValidatePayload[userPrincipalsPropfindPayload](context)
		if !payloadIsValid {
			return
		}

		if payload.XMLNSD != "DAV:" {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusNotFound, "Not Found")
			return
		}

		user := users.GetUserFromContext(context)
		username := context.Param("username")
		if user.Username != username {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusNotFound, "Not Found")
			return
		}

		response, err := makeUserPrincipalsPropfindResponse(context, db)(*payload, *user)
		if err == errAddressBookNotFoundForPropfind {
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusNotFound, "Address book not found")
			return
		}
		if err != nil {
			log.Println("Could not marshal response; error:", err)
			xmlutils.AbortWithMultiStatusXML(context)(http.StatusInternalServerError, "Internal Server Error")
			return
		}

		context.Data(http.StatusMultiStatus, PROPFIND_CONTENT_TYPE, response)
	}
}

func makeUserPrincipalsPropfindResponse(context *gin.Context, db *gorm.DB) func(payload userPrincipalsPropfindPayload, user users.User) ([]byte, error) {
	return func(payload userPrincipalsPropfindPayload, user users.User) ([]byte, error) {
		response := userPrincipalsPropfindResponse{
			XMLNS:     payload.XMLNSD,
			XMLNSCard: payload.XMLNSCard,
			Response: userPrincipalsPropfindResponseResponse{
				HREF: "/",
				Propstat: userPrincipalsPropfindResponseResponsePropstat{
					Status: fmt.Sprintf("HTTP/1.1 %d %s", http.StatusOK, "OK"),
					Prop:   []userPrincipalsPropfindResponseResponsePropstatProp{},
				},
			},
		}

		if payload.Prop.AddressHomeSet != nil {
			addressBook, err := users.GetOrCreateRootAddressBook(db)(user)
			if err != nil {
				xmlutils.AbortWithMultiStatusXML(context)(http.StatusNotFound, "Not Found")
				return nil, errAddressBookNotFoundForPropfind
			}

			response.Response.Propstat.Prop = append(
				response.Response.Propstat.Prop,
				userPrincipalsPropfindResponseResponsePropstatProp{
					AddressHomeSet: userPrincipalsPropfindResponseResponsePropstatPropAddressHomeSet{
						HREF: addressBook.Path(),
					},
				},
			)
		}

		marshalledResponse, err := xml.MarshalIndent(response, "", " ")
		if err != nil {
			return nil, err
		}

		return marshalledResponse, nil
	}
}

type userPrincipalsPropfindResponse struct {
	xmlutils.MultiStatusXML
	XMLNS     string                                 `xml:"xmlns:d,attr"`
	XMLNSCard string                                 `xml:"xmlns:card,attr"`
	Response  userPrincipalsPropfindResponseResponse `xml:"d:response"`
}

type userPrincipalsPropfindResponseResponse struct {
	HREF     string                                         `xml:"d:href"`
	Propstat userPrincipalsPropfindResponseResponsePropstat `xml:"d:propstat"`
}

type userPrincipalsPropfindResponseResponsePropstat struct {
	xmlutils.MultiStatusXMLPropstat
	Status string                                               `xml:"d:status"`
	Prop   []userPrincipalsPropfindResponseResponsePropstatProp `xml:"d:prop"`
}

type userPrincipalsPropfindResponseResponsePropstatProp struct {
	AddressHomeSet userPrincipalsPropfindResponseResponsePropstatPropAddressHomeSet `xml:"c:addressbook-home-set,omitempty"`
}

type userPrincipalsPropfindResponseResponsePropstatPropAddressHomeSet struct {
	HREF string `xml:"d:href"`
}

type userPrincipalsPropfindPayload struct {
	XMLName   xml.Name                          `xml:"propfind"`
	XMLNSD    string                            `xml:"d,attr"`
	XMLNSCard string                            `xml:"card,attr"`
	Prop      userPrincipalsPropfindPayloadProp `xml:"prop"`
}

type userPrincipalsPropfindPayloadProp struct {
	AddressHomeSet *xml.Name `xml:"addressbook-home-set"`
}
