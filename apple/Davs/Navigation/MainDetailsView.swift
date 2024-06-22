//
//  MainDetailsView.swift
//  Davs
//
//  Created by Kamaal M Farah on 21/06/2024.
//

import SwiftUI
import KamaalUI
import KamaalPopUp
import DavsContacts
import Authentication

struct MainDetailsView: View {
    @Environment(Authentication.self) private var authentication

    @StateObject private var popUpManager = KPopUpManager()

    var body: some View {
        NavigationStack {
            KJustStack {
                if authentication.initiallyValidatingToken {
                    KLoading()
                }
                if authentication.isLoggedIn {
                    ContactsScreen()
                } else {
                    LoginScreen()
                }
            }
            .withKPopUp(popUpManager)
        }
    }
}

#Preview {
    MainDetailsView()
}
