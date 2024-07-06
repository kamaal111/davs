//
//  ContactsScreen.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//


import SwiftUI
import KamaalUI
import DavsClient
import KamaalPopUp
import Authentication
import KamaalExtensions

public struct ContactsScreen: View {
    @Environment(Authentication.self) private var authentication
    @Environment(ContactsManager.self) private var contactsManager
    @EnvironmentObject private var popUpManager: KPopUpManager

    @State private var showAddContactsSheet = false

    public init() { }

    public var body: some View {
        VStack {
            if contactsManager.contacts.isEmpty {
                Button(action: handleAddContact) {
                    Text("No contacts yet\nPress here to add one")
                        .multilineTextAlignment(.center)
                        .font(.headline)
                        .foregroundColor(.accentColor)
                }
                .buttonStyle(.plain)
                .ktakeSizeEagerly(alignment: .top)
                #if os(macOS)
                .padding(.top, 8)
                #endif
            } else {
                List(contactsManager.contacts) { contact in
                    Text(contact.firstName ?? NSLocalizedString("No first name", comment: ""))
                }
            }
        }
        .toolbar { toolbarItems }
        .navigationTitle(Text("Contacts"))
        .sheet(isPresented: $showAddContactsSheet) {
            AddContactSheet(isPresented: $showAddContactsSheet, onSave: handleOnContactSave)
        }
    }

    private var toolbarItems: some ToolbarContent {
        ToolbarItem {
            Button(action: handleAddContact) {
                Image(systemName: "plus")
                    .bold()
            }
        }
    }

    private func handleOnContactSave(_ contactPayload: AddContactPayload) {
        Task {
            let result = await contactsManager.createContact(payload: contactPayload)
            switch result {
            case .failure(let failure):
                await handleContactSaveFailure(failure)
                return
            case .success: break
            }

            popUpManager.hidePopUp()
            closeAddContactSheet()
        }
    }

    private func handleContactSaveFailure(_ failure: DavsContactsErrors) async {
        switch failure {
        case .invalidResponse, .generalFailure, .decodingFailed:
            popUpManager.showPopUp(style: .bottom(
                title: NSLocalizedString("Something went wrong", comment: ""),
                type: .error,
                description: nil
            ), timeout: 3)
        case .notLoggedIn:
            popUpManager.showPopUp(style: .bottom(
                title: NSLocalizedString("Not logged in", comment: ""),
                type: .error,
                description: nil
            ), timeout: 3)
            await authentication.logout()
        }
    }

    private func handleAddContact() {
        showAddContactsSheet = true
    }

    private func closeAddContactSheet() {
        showAddContactsSheet = false
    }
}

#Preview {
    ContactsScreen()
        .frame(width: 400, height: 400)
        .padding(14)
        .previewLayout(.sizeThatFits)
}
