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
    case encodingFailed(context: Error)
}

enum RequestMethods: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
}

public class BaseDavsClient {
    private let jsonDecoder = JSONDecoder()

    func makeAuthorizationHeader() async -> (key: String, value: String)? {
        guard let authorizationToken = await getAuthorizationToken() else { return nil }

        return ("authorization", "Bearer \(authorizationToken)")
    }

    func requestJSON<Response: Decodable, Payload: Encodable>(
        for url: URL,
        method: RequestMethods,
        jsonPayload: Payload
    ) async -> Result<Response, RequestErrors> {
        let encodedPayload: Data
        do {
            encodedPayload = try JSONEncoder().encode(jsonPayload)
        } catch {
            return .failure(.encodingFailed(context: error))
        }

        return await requestJSON(for: url, method: method, payloadData: encodedPayload)
    }

    func requestJSON<Response: Decodable>(
        for url: URL,
        method: RequestMethods = .get,
        payloadData: Data? = nil,
        headersDict: [String: String]? = nil
    ) async -> Result<Response, RequestErrors> {
        let data: Data
        let result = await request(for: url, method: method, payloadData: payloadData, headersDict: headersDict)
        switch result {
        case .failure(let failure): return .failure(failure)
        case .success(let success): data = success
        }

        let decodedData: Response
        do {
            decodedData = try jsonDecoder.decode(Response.self, from: data)
        } catch {
            return .failure(.decodingFailed(context: error))
        }

        return .success(decodedData)
    }

    func request(
        for url: URL,
        method: RequestMethods = .get,
        payloadData: Data? = nil,
        headersDict: [String: String]? = nil
    ) async -> Result<Data, RequestErrors> {
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.httpBody = payloadData
        request.allHTTPHeaderFields = headersDict
        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch {
            return .failure(.requestFailed(context: error))
        }

        guard let httpResponse = response as? HTTPURLResponse else { return .failure(.invalidResponse(status: nil)) }

        let statusCode = httpResponse.statusCode
        guard statusCode < 300 else { return .failure(.invalidResponse(status: statusCode)) }

        return .success(data)
    }

    private func getAuthorizationToken() async -> String? {
        await DavsClientState.shared.authorizationToken
    }
}
