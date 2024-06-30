//
//  ContactTests.swift
//  
//
//  Created by Kamaal M Farah on 30/06/2024.
//

import Testing
import Foundation
@testable import DavsContacts

@Suite
struct ContactTests {
    @Test func parseFirstNameFromVCard() {
        let contact = Contact(
            id: UUID(uuidString: "c6863fa4-66bd-4b08-ad60-9fe2ae8e85ef")!,
            etag: "1-2",
            vcard: """
            BEGIN:VCARD
            VERSION:1.0
            PRODID:-//Davs/EN
            N:Farah;M;Kamaal;;;
            FN:Kamaal Farah
            END:VCARD
            """)

        #expect(contact.firstName == "Kamaal M")
    }
}
