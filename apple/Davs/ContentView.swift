//
//  ContentView.swift
//  Davs
//
//  Created by Kamaal M Farah on 10/06/2024.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    var body: some View {
        NavigationSplitView {
            Text("Hello")
            #if os(macOS)
            .navigationSplitViewColumnWidth(min: 180, ideal: 200)
            #endif
            .toolbar {
            #if os(iOS)
            ToolbarItem(placement: .navigationBarTrailing) {
                EditButton()
            }
            #endif
            }
        } detail: {
            Text("Select an item")
        }
    }
}

#Preview {
    ContentView()
}
