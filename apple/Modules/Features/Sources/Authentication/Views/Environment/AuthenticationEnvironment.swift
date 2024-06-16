//
//  AuthenticationEnvironment.swift
//  
//
//  Created by Kamaal M Farah on 16/06/2024.
//

import SwiftUI

extension View {
    public func authenticationEnvironment(authentication: Authentication) -> some View {
        modifier(AuthenticationEnvironment(authentication: authentication))
    }
}

private struct AuthenticationEnvironment: ViewModifier {
    private var authentication: Authentication

    init(authentication: Authentication) {
        self.authentication = authentication
    }

    func body(content: Content) -> some View {
        content
            .environment(authentication)
    }
}
