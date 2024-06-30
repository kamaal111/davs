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
        """
        BEGIN:VCARD
        VERSION:1.0
        PRODID:-//Davs/EN
        N:\(fullname.split(separator: " ").reversed().joined(separator: ";"));;;
        END:VCARD
        """
    }

    var fullname: String {
        guard let lastName else { return firstName }

        return [firstName, lastName]
            .joined(separator: " ")
    }
}
