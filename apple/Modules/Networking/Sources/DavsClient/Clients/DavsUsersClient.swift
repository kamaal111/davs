//
//  DavsUsersClient.swift
//  
//
//  Created by Kamaal M Farah on 19/06/2024.
//

import Foundation

public enum DavsUsersLoginError: Error {
    case requestFailed(context: Error)
    case invalidResponse(status: Int?)
    case decodingFailed(context: Error)
    case encodingFailed(context: Error)
}

public struct DavsUsersLoginPayload: Encodable {
    public let username: String
    public let password: String

    public init(username: String, password: String) {
        self.username = username
        self.password = password
    }
}

public struct DavsUsersLoginResponse: Decodable {
    public let authorizationToken: String

    enum CodingKeys: String, CodingKey {
        case authorizationToken = "authorization_token"
    }
}

final public class DavsUsersClient: BaseDavsClient {
    private let baseURL: URL

    init(baseURL: URL) {
        self.baseURL = baseURL.appending(path: "users")
    }

    public func login(payload: DavsUsersLoginPayload) async -> Result<DavsUsersLoginResponse, DavsUsersLoginError> {
        await request(for: baseURL.appending(path: "login"), method: .post, payloadObject: payload)
            .mapError({ error -> DavsUsersLoginError in
                switch error {
                case .requestFailed:
                    return .requestFailed(context: error)
                case .invalidResponse(let status):
                    return .invalidResponse(status: status)
                case .decodingFailed:
                    return .decodingFailed(context: error)
                case .encodingFailed:
                    return .encodingFailed(context: error)
                }
            })
    }
}
