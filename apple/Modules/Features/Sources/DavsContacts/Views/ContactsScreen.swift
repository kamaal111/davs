//
//  ContactsScreen.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//


import SwiftUI
import KamaalUI
import DavsClient
import KamaalExtensions

public struct ContactsScreen: View {
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
                    Text(contact.name ?? NSLocalizedString("No name", comment: ""))
                }
            }
        }
        .toolbar { toolbarItems }
        .navigationTitle(Text("Contacts"))
        #if os(iOS)
        .navigationBarTitleDisplayMode(.large)
        #endif
        .sheet(isPresented: $showAddContactsSheet) {
            AddContactSheet(isPresented: $showAddContactsSheet, onSave: handleOnContactSave)
        }
        .onAppear(perform: {
            Task {
                let response = await DavsClient.shared.health.ping()
                print("response", response)
            }
        })
    }

    private var toolbarItems: some ToolbarContent {
        ToolbarItem {
            Button(action: handleAddContact) {
                Image(systemName: "plus")
                    .bold()
            }
        }
    }

    private func handleOnContactSave(_ contact: Contact) {
        contacts = contacts.prepended(contact)
    }

    private func handleAddContact() {
        showAddContactsSheet = true
    }
}

#Preview {
    ContactsScreen()
        .frame(width: 400, height: 400)
        .padding(14)
        .previewLayout(.sizeThatFits)
}
