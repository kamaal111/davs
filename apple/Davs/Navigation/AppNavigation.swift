//
//  AppNavigation.swift
//  Davs
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import SwiftUI

struct AppNavigation: View {
    @State private var selectedTab: Tabs = .contacts

    var body: some View {
        #if os(macOS)
        NavigationSplitView(sidebar: {
            Sidebar()
        }, detail: {
            MainDetailsView()
        })
        #else
        TabView(selection: $selectedTab) {
            Tab(Tabs.contacts.title, systemImage: Tabs.contacts.imageSystemName, value: .contacts) {
                MainDetailsView()
            }
        }
        .tabViewStyle(.sidebarAdaptable)
        #endif
    }
}

#Preview {
    AppNavigation()
}
