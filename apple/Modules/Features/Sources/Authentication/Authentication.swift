//
//  Authentication.swift
//  
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import DavsClient
import Foundation
import Observation

@Observable
final public class Authentication {
    public init() { }

    public func login(username: String, password: String) async {
        let response = await DavsClient.shared.health.ping()
        print("response", response)
        print("username", username)
        print("password", password)
    }
}
