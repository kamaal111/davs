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
struct ContactTests {
    @Test func vcard() async throws {
        let contact = Contact(
            id: UUID(uuidString: "8d1f182d-c116-4074-88df-0bb5291d9287")!,
            firstName: "Kamaal",
            lastName: "Farah",
            createdAt: Date(timeIntervalSince1970: 1719674251),
            updatedAt: Date(timeIntervalSince1970: 1719674251)
        )

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
