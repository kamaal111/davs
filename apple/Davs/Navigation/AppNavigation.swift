//
//  AppNavigation.swift
//  Davs
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import SwiftUI
import DavsContacts

enum Tabs: Equatable, Hashable, Identifiable {
    case contacts

    var id: Tabs { self }
}

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
            Tab("Contacts", systemImage: "person.crop.circle.fill", value: .contacts) {
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
