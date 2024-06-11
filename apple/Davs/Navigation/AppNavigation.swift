//
//  AppNavigation.swift
//  Davs
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import SwiftUI
import DavsContacts

struct AppNavigation: View {
    @State private var selectedTab: Tabs = .contacts

    var body: some View {
        #if os(macOS)
        NavigationSplitView(sidebar: {
            Sidebar()
        }, detail: {
            ContactsScreen()
        })
        #else
        TabView(selection: $selectedTab) {
            Tab(Tabs.contacts.title, systemImage: Tabs.contacts.imageSystemName, value: .contacts) {
                NavigationStack {
                    ContactsScreen()
                }
            }
        }
        .tabViewStyle(.sidebarAdaptable)
        #endif
    }
}

#Preview {
    AppNavigation()
}
