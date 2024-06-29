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

    public func session(
        headers: DavsUsersSessionHeaders
    ) async -> Result<DavsUsersSessionResponse, DavsUsersSessionError> {
        let headers = [
            "authorization": "Bearer \(headers.authorization)"
        ]

        return await request(for: baseURL.appending(path: "session"), method: .get, headersDict: headers)
            .mapError({ error in
                switch error {
                case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
                case .invalidResponse(let status): .invalidResponse(status: status)
                }
            })
    }

    public func login(payload: DavsUsersLoginPayload) async -> Result<DavsUsersLoginResponse, DavsUsersLoginError> {
        await request(for: baseURL.appending(path: "login"), method: .post, payloadObject: payload)
            .mapError({ error in
                switch error {
                case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
                case .invalidResponse(let status): .invalidResponse(status: status)
                }
            })
    }
}
