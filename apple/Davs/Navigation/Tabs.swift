//
//  Tabs.swift
//  Davs
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

enum Tabs: Equatable, Hashable, Identifiable, CaseIterable {
    case contacts

    var id: Tabs { self }

    var imageSystemName: String {
        switch self {
        case .contacts: "person.crop.circle.fill"
        }
    }

    var title: String {
        switch self {
        case .contacts: NSLocalizedString("Contacts", comment: "")
        }
    }
}
