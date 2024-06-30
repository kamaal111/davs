//
//  AddContactPayload.swift
//  
//
//  Created by Kamaal M Farah on 30/06/2024.
//

struct AddContactPayload {
    let firstName: String
    let lastName: String?

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
