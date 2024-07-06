//
//  DavsUsersSignUpError.swift
//  
//
//  Created by Kamaal M Farah on 06/07/2024.
//

public enum DavsUsersSignUpError: Error {
    case invalidResponse(status: Int?)
    case generalFailure(context: Error)
    case unsupported
}
