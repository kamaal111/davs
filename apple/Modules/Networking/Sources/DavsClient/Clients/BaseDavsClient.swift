//
//  BaseDavsClient.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

enum RequestErrors: Error {
    case requestFailed(context: Error)
    case invalidResponse(status: Int?)
    case decodingFailed(context: Error)
}

public class BaseDavsClient {
    private let jsonDecoder = JSONDecoder()

    func request<T: Decodable>(for url: URL) async -> Result<T, RequestErrors> {
        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(from: url)
        } catch {
            return .failure(.requestFailed(context: error))
        }

        guard let httpResponse = response as? HTTPURLResponse else { return .failure(.invalidResponse(status: nil)) }

        let statusCode = httpResponse.statusCode
        guard statusCode < 300 else { return .failure(.invalidResponse(status: statusCode)) }

        let result: T
        do {
            result = try jsonDecoder.decode(T.self, from: data)
        } catch {
            return .failure(.decodingFailed(context: error))
        }

        return .success(result)
    }
}
