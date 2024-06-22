//
//  Authentication.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import DavsClient
import Foundation
import Observation

public enum LoginErrors: Error {
    case invalidCredentials
    case generalFailure(context: Error)
}

@Observable
final public class Authentication {
    public private(set) var initiallyValidatingToken: Bool
    private var session: DavsUsersSessionResponse?

    public init() {
        if let authorizationToken = try? Keychain.get(forKey: KeychainKeys.authorizationToken.key).get() {
            self.initiallyValidatingToken = true
            Task { await loadSession(authorizationToken: authorizationToken) }
        } else {
            self.initiallyValidatingToken = false
        }
    }

    public var isLoggedIn: Bool {
        session != nil
    }

    public func login(username: String, password: String) async -> Result<Void, LoginErrors> {
        let response = await DavsClient.shared.users.login(
            payload: DavsUsersLoginPayload(username: username, password: password)
        )
            .mapError({ error -> LoginErrors in
                switch error {
                case .generalFailure: .generalFailure(context: error)
                case .invalidResponse(let status):
                    switch status {
                    case 403: .invalidCredentials
                    default: .generalFailure(context: error)
                    }
                }
            })
        let authorizationToken: String
        switch response {
        case .failure(let failure): return .failure(failure)
        case .success(let success): authorizationToken = success.authorizationToken
        }

        let addToKeyChainResult = Keychain.add(authorizationToken, forKey: KeychainKeys.authorizationToken.key)
            .mapError({ error -> LoginErrors in .generalFailure(context: error) })
        switch addToKeyChainResult {
        case .failure(let failure): return .failure(failure)
        case .success: break
        }

        await loadSession(authorizationToken: authorizationToken)
        return .success(())
    }

    private func loadSession(authorizationToken: String) async {
        let result = await DavsClient.shared.users.session(
            headers: DavsUsersSessionHeaders(authorization: authorizationToken)
        )
        switch result {
        case .failure: Keychain.delete(forKey: KeychainKeys.authorizationToken.key)
        case .success(let success): await setSession(success)
        }
        await setInitiallyValidatingToken(false)
    }

    @MainActor
    private func setInitiallyValidatingToken(_ value: Bool) {
        guard initiallyValidatingToken != value else { return }

        initiallyValidatingToken = value
    }

    @MainActor
    private func setSession(_ session: DavsUsersSessionResponse?) {
        self.session = session
    }
}

private enum KeychainKeys: String {
    case authorizationToken

    var key: String {
        "\(Bundle.main.bundleIdentifier!).Authentication.Keychain.\(self.rawValue)"
    }
}