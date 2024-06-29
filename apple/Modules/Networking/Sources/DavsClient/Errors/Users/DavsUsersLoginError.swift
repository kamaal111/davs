//
//  DavsUsersLoginError.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public enum DavsUsersLoginError: Error {
    case invalidResponse(status: Int?)
    case generalFailure(context: Error)
}
