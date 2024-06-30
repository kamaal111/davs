//
//  DavsContactsMutatePayload.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public struct DavsContactsMutatePayload {
    public let addressBookName: String
    public let filename: String
    public let vcard: String

    public init(addressBookName: String, filename: String, vcard: String) {
        self.addressBookName = addressBookName
        self.filename = filename
        self.vcard = vcard
    }
}
