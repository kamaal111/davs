//
//  DavsApp.swift
//  Davs
//
//  Created by Kamaal M Farah on 10/06/2024.
//

import SwiftUI
import SwiftData
import Authentication

@main
struct DavsApp: App {
    @State private var authentication = Authentication()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .authenticationEnvironment(authentication: authentication)
        }
        .modelContainer(sharedModelContainer)
    }

    private var sharedModelContainer: ModelContainer = {
        let schema = Schema([])
        let modelConfiguration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)

        do {
            return try ModelContainer(for: schema, configurations: [modelConfiguration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()
}
