//
//  AddContactSheet.swift
//
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import SwiftUI
import KamaalUI

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
            VStack {
                if !name.isEmpty {
                    Text("Name")
                        .font(.caption)
                        .ktakeWidthEagerly(alignment: .leading)
                }
                TextField("Name", text: $name)
            }
        }
        .padding()
        .frame(minWidth: 400)
        .ktakeSizeEagerly(alignment: .top)
    }

    private func handleCancel() {
        isPresented = false
    }

    private func handleSave() {
        let name: String? = if self.name.isEmpty { nil } else { self.name }
        let contact = Contact(id: UUID(), name: name, createdAt: Date(), updatedAt: Date())
        onSave(contact)
        isPresented = false
    }
}

#Preview {
    AddContactSheet(isPresented: .constant(true), onSave: { _ in })
}
