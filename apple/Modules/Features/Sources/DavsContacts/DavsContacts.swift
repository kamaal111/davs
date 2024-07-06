//
//  DavsContacts.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import SwiftUI

extension View {
    public func davContactsEnvironment() -> some View {
        modifier(DavsContactsEnvironment())
    }
}

private struct DavsContactsEnvironment: ViewModifier {
    @State private var contactsManager = ContactsManager()

    func body(content: Content) -> some View {
        content
            .environment(contactsManager)
    }
}
