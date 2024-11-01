//
//  DavsClient.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

public actor DavsClient {
    public let health: DavsHealthClient
    public let users: DavsUsersClient
    public let contacts: DavsContactsClient

    init() {
        let secrets = SecretsJSON()
        let secretsContent = secrets.content
        let baseURL = secretsContent.davsBaseURL.appending(path: "api/v1")
        self.health = DavsHealthClient(baseURL: baseURL)
        self.users = DavsUsersClient(baseURL: baseURL, apiKey: secretsContent.davsAPIKey)
        self.contacts = DavsContactsClient(baseURL: baseURL)
    }

    public static let shared = DavsClient()

    public func setAuthorizationToken(_ token: String) async {
        await DavsClientState.shared.setAuthorizationToken(token)
    }

    public func clearAuthorizationToken() async {
        await DavsClientState.shared.clearAuthorizationToken()
    }
}
