//
//  Contact.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation
import KamaalExtensions

struct Contact: Hashable, Identifiable {
    let id: UUID
    let firstName: String?
    let lastnName: String?
    let createdAt: Date
    let updatedAt: Date?

    var vcard: String {
        var base = """
BEGIN:VCARD
VERSION:1.0
PRODID:-//Davs/EN
"""
        if let fullname {
            base += "\nN:\(fullname.split(separator: " ").reversed().joined(separator: ";"));;;"
        }
        return base + "\nEND:VCARD"
    }

    var fullname: String? {
        let unpackedNames = [firstName, lastnName]
            .unpacked()
        guard !unpackedNames.isEmpty else { return nil }

        return unpackedNames
            .joined(separator: " ")
    }
}
