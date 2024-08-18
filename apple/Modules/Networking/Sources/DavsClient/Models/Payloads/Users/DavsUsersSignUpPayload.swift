//
//  DavsUsersSignUpPayload.swift
//  
//
//  Created by Kamaal M Farah on 06/07/2024.
//

public struct DavsUsersSignUpPayload: Encodable, Sendable {
    public let username: String
    public let password: String

    public init(username: String, password: String) {
        self.username = username
        self.password = password
    }
}
