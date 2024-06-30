//
//  AddContactSheet.swift
//
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import DavsUI
import SwiftUI
import KamaalUI
import KamaalExtensions

struct AddContactSheet: View {
    @Binding var isPresented: Bool

    let onSave: (Contact) -> Void

    @State private var firstName = ""
    @State private var lastName = ""

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Button(action: handleCancel) {
                    Text("Cancel")
                }
                .ktakeWidthEagerly(alignment: .leading)
                Text("Add contact")
                    .font(.headline)
                    .ktakeWidthEagerly()
                Button(action: handleSave) {
                    Text("Save")
                }
                .disabled(!contactIsValid)
                .ktakeWidthEagerly(alignment: .trailing)
            }
            DavsTextField(value: $firstName, localizedLabel: "First name", bundle: .module)
            DavsTextField(value: $lastName, localizedLabel: "Last name", bundle: .module)
        }
        .onSubmit(handleSave)
        .padding()
        .frame(minWidth: 400)
        .ktakeSizeEagerly(alignment: .top)
    }

    private var contactIsValid: Bool {
        names != nil
    }

    private var names: (firstName: String, lastName: String?)? {
        let firstName = self.firstName.trimmingByWhitespacesAndNewLines
        guard !firstName.isEmpty else { return nil }

        let trimmedLastName = lastName.trimmingByWhitespacesAndNewLines
        let lastName: String? = if !trimmedLastName.isEmpty { trimmedLastName } else { nil }

        return (firstName, lastName)
    }

    private func handleCancel() {
        dismissSheet()
    }

    private func handleSave() {
        guard let names else { return }

        let now = Date()
        let contact = Contact(
            id: UUID(),
            firstName: names.firstName,
            lastName: names.lastName,
            createdAt: now,
            updatedAt: now
        )
        onSave(contact)
        dismissSheet()
    }

    private func dismissSheet() {
        isPresented = false
    }
}

#Preview {
    AddContactSheet(isPresented: .constant(true), onSave: { _ in })
}
