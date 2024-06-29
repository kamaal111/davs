//
//  DavsUsersClient.swift
//  
//
//  Created by Kamaal M Farah on 19/06/2024.
//

import Foundation

final public class DavsUsersClient: BaseDavsClient {
    private let baseURL: URL

    init(baseURL: URL) {
        self.baseURL = baseURL.appending(path: "users")
    }

    public func session() async -> Result<DavsUsersSessionResponse, DavsUsersSessionError> {
        guard let authorizationHeader = await makeAuthorizationHeader() else { return .failure(.notLoggedIn) }

        let headers = [
            authorizationHeader.key: authorizationHeader.value
        ]

        return await requestJSON(for: baseURL.appending(path: "session"), method: .get, headersDict: headers)
            .mapError({ error in
                switch error {
                case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
                case .invalidResponse(let status): .invalidResponse(status: status)
                }
            })
    }

    public func login(payload: DavsUsersLoginPayload) async -> Result<DavsUsersLoginResponse, DavsUsersLoginError> {
        await requestJSON(for: baseURL.appending(path: "login"), method: .post, jsonPayload: payload)
            .mapError({ error in
                switch error {
                case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
                case .invalidResponse(let status): .invalidResponse(status: status)
                }
            })
    }
}
