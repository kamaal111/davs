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
    public init() { }

    public func login(username: String, password: String) async -> Result<Void, LoginErrors> {
        let response = await DavsClient.shared.users.login(
            payload: DavsUsersLoginPayload(username: username, password: password)
        )
            .mapError({ error -> LoginErrors in
                switch error {
                case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
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
        print("authorizationToken", authorizationToken)

        return .success(())
    }
}
