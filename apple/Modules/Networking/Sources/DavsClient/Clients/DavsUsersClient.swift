//
//  DavsUsersClient.swift
//  
//
//  Created by Kamaal M Farah on 19/06/2024.
//

import Foundation

final public class DavsUsersClient: BaseDavsClient {
    private let baseURL: URL
    private let apiKey: String

    init(baseURL: URL, apiKey: String) {
        self.baseURL = baseURL.appending(path: "users")
        self.apiKey = apiKey
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

    public func signUp(payload: DavsUsersSignUpPayload) async -> Result<DavsUsersSignUpResponse, DavsUsersSignUpError> {
        let headers = [
            "authorization": "Token \(apiKey)",
        ]
        return await requestJSON(
            for: baseURL.appending(path: "sign-up"),
            method: .post,
            jsonPayload: payload,
            headersDict: headers
        )
        .mapError({ error in
            switch error {
            case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
            case .invalidResponse(let status): .invalidResponse(status: status)
            }
        })
    }
}
