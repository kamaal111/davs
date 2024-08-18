//
//  DavsUsersLoginPayload.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public struct DavsUsersLoginPayload: Encodable, Sendable {
    public let username: String
    public let password: String

    public init(username: String, password: String) {
        self.username = username
        self.password = password
    }
}
