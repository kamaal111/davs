//
//  ContentView.swift
//  Davs
//
//  Created by Kamaal M Farah on 10/06/2024.
//

import SwiftUI
import DavsContacts

struct ContentView: View {
    var body: some View {
        NavigationSplitView(sidebar: { Sidebar() }, detail: { ContactsScreen() })
    }
}

#Preview {
    ContentView()
}
