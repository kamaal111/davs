//
//  DavsClient.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

final public class DavsClient {
    public let health: DavsHealthClient
    public let users: DavsUsersClient

    private init() {
        let secrets = SecretsJSON.shared.content
        let baseURL = secrets.davsBaseURL.appending(path: "api/v1")
        self.health = DavsHealthClient(baseURL: baseURL)
        self.users = DavsUsersClient(baseURL: baseURL)
    }

    public static let shared = DavsClient()
}
