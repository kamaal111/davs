//
//  Contact.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

struct Contact: Hashable, Identifiable {
    let id: UUID
    let firstName: String
    let lastName: String?
    let createdAt: Date
    let updatedAt: Date?

    var vcard: String {
        let fullName = self.fullName
        return """
        BEGIN:VCARD
        VERSION:1.0
        PRODID:-//Davs/EN
        N:\(fullName.split(separator: " ").reversed().joined(separator: ";"));;;
        FN:\(fullName)
        END:VCARD
        """
    }

    var fullName: String {
        guard let lastName else { return firstName }

        return [firstName, lastName]
            .joined(separator: " ")
    }
}
