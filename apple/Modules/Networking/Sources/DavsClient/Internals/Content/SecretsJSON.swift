//
//  SecretsJSON.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation
import KamaalUtils

struct Secrets: Decodable {
    let davsBaseURL: URL
    let davsAPIKey: String?

    enum CodingKeys: String, CodingKey {
        case davsBaseURL = "davs_base_url"
        case davsAPIKey = "davs_api_key"
    }
}

class SecretsJSON {
    private(set) var content: Secrets

    private init() {
        self.content = try! JSONFileUnpacker<Secrets>(filename: "secrets", bundle: .module).content
    }

    nonisolated(unsafe) static let shared = SecretsJSON()
}
