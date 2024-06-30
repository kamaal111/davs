//
//  Contact.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation
import KamaalExtensions

struct Contact: Hashable, Identifiable {
    let id: UUID
    let etag: String
    let vcard: String
    private let vcardMap: [String: String]

    init(id: UUID, etag: String, vcard: String) {
        self.id = id
        self.etag = etag
        self.vcard = vcard
        self.vcardMap = vcard
            .splitLines
            .reduce([:], { result, line in
                let separator = ":"
                let splittenLine = line.split(separator: separator)
                guard splittenLine.count >= 2 else { return result }

                let key = splittenLine[0]
                let value = splittenLine.ranged(from: 1).joined(separator: separator)

                return result
                    .merged(with: [
                        String(key): value
                    ])
            })
    }

    var firstName: String? {
        let name = vcardMap["N"]
        guard let name else { return nil }

        let firstName = name
            .split(separator: ";;;")
            .first?
            .split(separator: ";")
            .dropFirst()
            .reversed()
            .joined(separator: " ")
        guard let firstName else { return nil }

        return firstName
    }
}
