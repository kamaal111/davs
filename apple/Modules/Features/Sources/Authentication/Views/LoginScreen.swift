//
//  LoginScreen.swift
//
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import DavsUI
import SwiftUI

public struct LoginScreen: View {
    @Environment(Authentication.self) private var authentication

    @State private var username = ""
    @State private var password = ""

    public init() { }

    public var body: some View {
        Form {
            DavsTextField(
                value: $username,
                localizedLabel: "Username",
                bundle: .module,
                configration: .init(capitalazation: .never)
            )
            DavsTextField(value: $password, localizedLabel: "Password", bundle: .module, variant: .secure)
        }
        .navigationTitle(Text("Davs"))
    }
}

#Preview {
    LoginScreen()
}
