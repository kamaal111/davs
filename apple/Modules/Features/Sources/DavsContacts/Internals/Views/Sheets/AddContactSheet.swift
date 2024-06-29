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
    @State private var name = ""

    @Binding var isPresented: Bool

    let onSave: (Contact) -> Void

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
                .ktakeWidthEagerly(alignment: .trailing)
            }
            DavsTextField(value: $name, localizedLabel: "Name", bundle: .module)
                .onSubmit(handleSave)
        }
        .padding()
        .frame(minWidth: 400)
        .ktakeSizeEagerly(alignment: .top)
    }

    private func handleCancel() {
        isPresented = false
    }

    private func handleSave() {
        let nameComponents: [String.SubSequence] = if !self.name.isEmpty {
            self.name.split(separator: " ")
        } else {
            []
        }
        let firstName: String? = if !nameComponents.isEmpty {
            nameComponents.ranged(from: 0, to: nameComponents.count - 1).joined(separator: " ")
        } else {
            nil
        }
        let lastName: String? = if nameComponents.count > 1 { String(nameComponents.last!) } else { nil }
        let now = Date()
        let contact = Contact(id: UUID(), firstName: firstName, lastnName: lastName, createdAt: now, updatedAt: now)
        onSave(contact)
        isPresented = false
    }
}

#Preview {
    AddContactSheet(isPresented: .constant(true), onSave: { _ in })
}
