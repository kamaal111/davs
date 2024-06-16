//
//  ValidatableRule.swift
//  
//
//  Created by Kamaal M Farah on 16/06/2024.
//

public protocol ValidatableRule: Equatable {
    associatedtype Value: Equatable

    var code: String { get }
    var message: String? { get }

    func validate(_ value: Value) -> Bool
}
