//
//  DavsClientState.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

actor DavsClientState {
    private(set) var authorizationToken: String?

    func setAuthorizationToken(_ token: String) {
        authorizationToken = token
    }

    func clearAuthorizationToken() {
        authorizationToken = nil
    }

    static let shared = DavsClientState()
}
