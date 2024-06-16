//
//  ApplyIf.swift
//  
//
//  Created by Kamaal M Farah on 17/06/2024.
//

import SwiftUI

extension View {
    @ViewBuilder
    public func applyIf(_ condition: Bool, transformation: (_ view: Self) -> some View) -> some View {
        if condition {
            transformation(self)
        } else {
            self
        }
    }
}
