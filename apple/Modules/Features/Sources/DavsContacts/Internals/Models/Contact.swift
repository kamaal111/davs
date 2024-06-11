//
//  Contact.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import Foundation

struct Contact: Hashable, Identifiable {
    let id: UUID
    let name: String?
    let createdAt: Date
    let updatedAt: Date?
}
