//
//  DavsUsersLoginResponse.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public struct DavsUsersLoginResponse: Decodable, Sendable {
    public let authorizationToken: String

    enum CodingKeys: String, CodingKey {
        case authorizationToken = "authorization_token"
    }
}
