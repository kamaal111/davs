//
//  DavsApp.swift
//  Davs
//
//  Created by Kamaal M Farah on 10/06/2024.
//

import SwiftUI
import DavsContacts
import Authentication

@main
struct DavsApp: App {
    @State private var authentication = Authentication()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .davContactsEnvironment()
                .authenticationEnvironment(authentication: authentication)
        }
    }
}
