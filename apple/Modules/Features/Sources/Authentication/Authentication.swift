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

public enum SignUpErrors: Error {
    case userAlreadyExists
    case invalidCredentials
    case generalFailure(context: Error)
}

@MainActor
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

    public func logout() async {
        await DavsClient.shared.clearAuthorizationToken()
        Keychain.delete(forKey: KeychainKeys.authorizationToken.key)
        setSession(nil)
    }

    public func signUp(username: String, password: String) async -> Result<Void, SignUpErrors> {
        let response = await DavsClient.shared.users.signUp(payload: .init(username: username, password: password))
            .mapError({ error -> SignUpErrors in
                switch error {
                case .unsupported: fatalError("Unsupported endpoint, should not have came here at all")
                case .generalFailure: .generalFailure(context: error)
                case .invalidResponse(status: let status):
                    switch status {
                    case 409: .userAlreadyExists
                    case 403, 400, 401: .invalidCredentials
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
            .mapError({ error -> SignUpErrors in .generalFailure(context: error) })
        switch addToKeyChainResult {
        case .failure(let failure): return .failure(failure)
        case .success: break
        }

        await loadSession(authorizationToken: authorizationToken)
        return .success(())
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
        await DavsClient.shared.setAuthorizationToken(authorizationToken)
        let result = await DavsClient.shared.users.session()
        switch result {
        case .failure: await logout()
        case .success(let success): setSession(success)
        }
        setInitiallyValidatingToken(false)
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
