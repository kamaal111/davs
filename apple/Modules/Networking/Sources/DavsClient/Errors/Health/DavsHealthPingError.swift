//
//  DavsHealthPingError.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//

public enum DavsHealthPingError: Error {
    case invalidResponse(status: Int?)
    case generalFailure(context: Error)
}
