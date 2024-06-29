//
//  DavsHealthClient.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

final public class DavsHealthClient: BaseDavsClient {
    private let baseURL: URL

    init(baseURL: URL) {
        self.baseURL = baseURL.appending(path: "health")
    }

    public func ping() async -> Result<DavsHealthPingResponse, DavsHealthPingError> {
        await request(for: baseURL.appending(path: "ping"))
            .mapError({ error -> DavsHealthPingError in
                switch error {
                case .requestFailed, .decodingFailed, .encodingFailed: .generalFailure(context: error)
                case .invalidResponse(let status): .invalidResponse(status: status)
                }
            })
    }
}
