//
//  DavsContactsClient.swift
//  
//
//  Created by Kamaal M Farah on 29/06/2024.
//
import Foundation

final public class DavsContactsClient: BaseDavsClient {
    private let baseURL: URL

    init(baseURL: URL) {
        self.baseURL = baseURL.appending(path: "contacts")
    }
}
