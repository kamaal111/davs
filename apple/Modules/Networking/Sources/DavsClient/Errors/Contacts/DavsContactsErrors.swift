//
//  DavsContactsErrors.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public enum DavsContactsErrors: Error {
    case invalidResponse(status: Int?)
    case generalFailure(context: Error)
    case notLoggedIn
    case decodingFailed(context: Error?)
}
