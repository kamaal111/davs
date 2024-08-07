//
//  AuthenticationEnvironment.swift
//  
//
//  Created by Kamaal M Farah on 16/06/2024.
//

import SwiftUI
import KamaalUI
import KamaalPopUp

extension View {
    public func authenticationEnvironment(authentication: Authentication) -> some View {
        modifier(AuthenticationEnvironment(authentication: authentication))
    }
}

private struct AuthenticationEnvironment: ViewModifier {
    @StateObject private var popUpManager = KPopUpManager()

    private var authentication: Authentication

    init(authentication: Authentication) {
        self.authentication = authentication
    }

    func body(content: Content) -> some View {
        KJustStack {
            if authentication.initiallyValidatingToken {
                KLoading()
            } else {
                if !authentication.isLoggedIn {
                    NavigationStack {
                        LoginScreen()
                    }
                    .withKPopUp(popUpManager)
                } else {
                    content
                }
            }
        }
        .environment(authentication)
    }
}
