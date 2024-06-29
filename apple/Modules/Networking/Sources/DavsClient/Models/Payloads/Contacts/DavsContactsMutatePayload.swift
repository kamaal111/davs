//
//  DavsContactsMutatePayload.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public struct DavsContactsMutatePayload {
    public let filename: String
    public let vcard: String

    public init(filename: String, vcard: String) {
        self.filename = filename
        self.vcard = vcard
    }
}
