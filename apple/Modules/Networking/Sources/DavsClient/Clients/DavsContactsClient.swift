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
            authorizationHeader.key: authorizationHeader.value,
            "Content-Type": "text/vcard; charset=utf-8"
        ]

        let result = await request(
            for: baseURL.appending(path: payload.filename),
            method: .put,
            payloadData: payload.vcard.data(using: .utf8),
            headersDict: headers
        )
            .map({ data in String(data: data, encoding: .utf8) })
            .mapError({ error -> DavsContactsErrors in
                switch error {
                case .requestFailed, .encodingFailed: .generalFailure(context: error)
                case .decodingFailed: .decodingFailed(context: error)
                case .invalidResponse(status: let status):
                    switch status {
                    case 403: .notLoggedIn
                    default: .invalidResponse(status: status)
                    }
                }
            })
        let response: String?
        switch result {
        case .failure(let failure): return .failure(failure)
        case .success(let success): response = success
        }

        guard let response else { return .failure(.decodingFailed(context: nil)) }

        return .success(response)
    }
}
