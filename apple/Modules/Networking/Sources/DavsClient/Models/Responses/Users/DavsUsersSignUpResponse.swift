//
//  DavsUsersSignUpResponse.swift
//  
//
//  Created by Kamaal M Farah on 06/07/2024.
//

public struct DavsUsersSignUpResponse: Decodable {
    public let authorizationToken: String

    enum CodingKeys: String, CodingKey {
        case authorizationToken = "authorization_token"
    }
}
