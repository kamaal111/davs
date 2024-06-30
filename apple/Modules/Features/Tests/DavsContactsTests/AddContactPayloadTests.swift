//
//  ContactTests.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

import Testing
import Foundation
@testable import DavsContacts

@Suite
struct AddContactPayloadTests {
    @Test func vcard() async throws {
        let contact = AddContactPayload(firstName: "Kamaal", lastName: "Farah")

        #expect(contact.vcard == """
BEGIN:VCARD
VERSION:1.0
PRODID:-//Davs/EN
N:Farah;Kamaal;;;
FN:Kamaal Farah
END:VCARD
""")
    }
}
