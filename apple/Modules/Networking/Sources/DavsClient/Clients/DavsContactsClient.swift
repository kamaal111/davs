//
//  DavsContactsClient.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//
import Foundation

final public class DavsContactsClient: BaseDavsClient {
    private let baseURL: URL

    init(baseURL: URL) {
        self.baseURL = baseURL.appending(path: "contacts")
    }

    public func mutate(payload: DavsContactsMutatePayload) async -> Result<String, DavsContactsErrors> {
        guard let authorizationHeader = await makeAuthorizationHeader() else { return .failure(.notLoggedIn) }

        let headers = [
            authorizationHeader.key: authorizationHeader.value
        ]

        return await request(
            for: baseURL.appending(path: payload.filename),
            method: .put,
            payloadData: payload.vcard.data(using: .utf8),
            headersDict: headers
        )
        .mapError({ error in
            switch error {
            case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
            case .invalidResponse(status: let status):
                switch status {
                case 403: .notLoggedIn
                default: .invalidResponse(status: status)
                }
            }
        })
    }
}
