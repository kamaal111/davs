package xmlutils

import "encoding/xml"

type MultiStatusXML struct {
	XMLName  xml.Name                 `xml:"d:multistatus"`
	XMLNS    string                   `xml:"xmlns:d,attr"`
	Response []MultiStatusXMLResponse `xml:"d:response"`
}

type MultiStatusXMLResponse struct {
	Propstat MultiStatusXMLPropstat `xml:"d:propstat"`
}

type MultiStatusXMLPropstat struct {
	Status string `xml:"d:status"`
}
