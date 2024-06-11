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

    enum CodingKeys: String, CodingKey {
        case davsBaseURL = "davs_base_url"
    }
}

class SecretsJSON {
    private(set) var content: Secrets

    private init() {
        self.content = try! JSONFileUnpacker<Secrets>(filename: "secrets", bundle: .module).content
    }

    static let shared = SecretsJSON()
}
