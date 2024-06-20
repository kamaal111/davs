//
//  Keychain.swift
//  
//
//  Created by Kamaal M Farah on 20/06/2024.
//

import Foundation

enum KeychainAddErrors: Error {
    case duplicateEntry
    case generalError(status: OSStatus)
}

enum KeychainGetErrors: Error {
    case generalError(status: OSStatus)
}

struct Keychain {
    private init() { }

    static func add(_ token: String, forKey key: String) -> Result<Void, KeychainAddErrors> {
        let data = token.data(using: .utf8)!
        let query = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key,
            kSecValueData: data,
            kSecAttrAccessible: kSecAttrAccessibleWhenUnlocked
        ] as CFDictionary
        let status = SecItemAdd(query, nil)

        guard status != errSecDuplicateItem else { return .failure(.duplicateEntry) }
        guard status == errSecSuccess else { return .failure(.generalError(status: status)) }

        return .success(())
    }

    static func get(forKey key: String) -> Result<String?, KeychainGetErrors> {
        let query = [
            kSecClass: kSecClassGenericPassword,
            kSecAttrAccount: key,
            kSecReturnData: true,
            kSecMatchLimit: kSecMatchLimitOne
        ] as CFDictionary
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query, &dataTypeRef)
        guard status == errSecSuccess else { return .failure(.generalError(status: status)) }

        guard let data = dataTypeRef as? Data else { return .success(nil) }

        return .success(String(data: data, encoding: .utf8))
    }
}
