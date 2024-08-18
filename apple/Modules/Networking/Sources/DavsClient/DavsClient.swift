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
    public let contacts: DavsContactsClient

    private init() {
        let secrets = SecretsJSON.shared.content
        let baseURL = secrets.davsBaseURL.appending(path: "api/v1")
        self.health = DavsHealthClient(baseURL: baseURL)
        self.users = DavsUsersClient(baseURL: baseURL, apiKey: secrets.davsAPIKey)
        self.contacts = DavsContactsClient(baseURL: baseURL)
    }

    nonisolated(unsafe) public static let shared = DavsClient()

    public func setAuthorizationToken(_ token: String) async {
        await DavsClientState.shared.setAuthorizationToken(token)
    }

    public func clearAuthorizationToken() async {
        await DavsClientState.shared.clearAuthorizationToken()
    }
}
