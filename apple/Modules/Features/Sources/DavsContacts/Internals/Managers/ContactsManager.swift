//
//  ContactsManager.swift
//  
//
//  Created by Kamaal M Farah on 06/07/2024.
//

import Foundation
import DavsClient
import Observation
import KamaalExtensions

@Observable
final class ContactsManager {
    private(set) var contacts: [Contact] = []

    func createContact(payload: AddContactPayload) async -> Result<Void, DavsContactsErrors> {
        let id = UUID()
        let filename = "\(id.uuidString).vcf"
        let payload = DavsContactsMutatePayload(
            addressBookName: Constants.rootAddressBook,
            filename: filename,
            vcard: payload.vcard
        )
        let result = await DavsClient.shared.contacts.mutate(payload: payload)
        let etag: String
        switch result {
        case .failure(let failure): return .failure(failure)
        case .success(let success): etag = success
        }

        let contact = Contact(id: id, etag: etag, vcard: payload.vcard)
        await addToContacts(contact)

        return .success(())
    }

    @MainActor
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
}
