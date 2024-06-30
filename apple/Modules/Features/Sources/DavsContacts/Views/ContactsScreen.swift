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
    @EnvironmentObject private var popUpManager: KPopUpManager

    @State private var contacts: [Contact] = []
    @State private var showAddContactsSheet = false

    public init() { }

    public var body: some View {
        VStack {
            if contacts.isEmpty {
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
                List(contacts) { contact in
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
        let id = UUID()
        let filename = "\(id.uuidString).vcf"
        let payload = DavsContactsMutatePayload(
            addressBookName: Constants.rootAddressBook,
            filename: filename,
            vcard: contactPayload.vcard
        )
        Task {
            let result = await DavsClient.shared.contacts.mutate(payload: payload)
            let etag: String
            switch result {
            case .failure(let failure):
                await handleContactSaveFailure(failure)
                return
            case .success(let success):
                popUpManager.hidePopUp()
                etag = success
            }

            let contact = Contact(id: id, etag: etag, vcard: contactPayload.vcard)
            addToContacts(contact)
            closeAddContactSheet()
        }
    }

    private func addToContacts(_ contact: Contact) {
        let contactsMappedByWhetherTheyHaveAFirstName = contacts
            .appended(contact)
            .reduce((hasFirstName: [Contact](), doesNotHaveFirstName: [Contact]()), { result, contact in
                let hasFirstName = contact.firstName != nil

                if hasFirstName {
                    return (result.hasFirstName.appended(contact), result.doesNotHaveFirstName)
                }

                return (result.hasFirstName, result.doesNotHaveFirstName.appended(contact))
            })
        contacts = (contactsMappedByWhetherTheyHaveAFirstName.hasFirstName)
            .sorted(by: \.firstName!, using: .orderedAscending)
            .concat(contactsMappedByWhetherTheyHaveAFirstName.doesNotHaveFirstName)
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
