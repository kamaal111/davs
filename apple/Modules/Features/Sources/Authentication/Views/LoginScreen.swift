//
//  LoginScreen.swift
//
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import DavsUI
import SwiftUI
import KamaalUI
import SwiftValidator

public struct LoginScreen: View {
    @Environment(Authentication.self) private var authentication

    @State private var username = ""
    @State private var usernameError: (valid: Bool, message: String?)?
    @State private var password = ""
    @State private var passwordError: (valid: Bool, message: String?)?
    @State private var isLogingIn = false

    @FocusState private var focusedTextfield: FocusFields?

    public init() { }

    public var body: some View {
        Form {
            DavsTextField(
                value: $username,
                errorResult: $usernameError,
                localizedLabel: "Username",
                bundle: .module,
                configration: DavsTextFieldConfiguration(capitalazation: .never),
                validations: [
                    .minimumLength(
                        length: 1,
                        message: NSLocalizedString("Username should be atleast 1 character long", comment: "")
                    )
                ]
            )
            .focused($focusedTextfield, equals: .username)
            .onSubmit { login() }
            DavsTextField(
                value: $password,
                errorResult: $passwordError,
                localizedLabel: "Password",
                bundle: .module,
                variant: .secure,
                configration: DavsTextFieldConfiguration(capitalazation: .never),
                validations: [
                    .minimumLength(
                        length: 5,
                        message: NSLocalizedString("Password should be atleast 5 characters long", comment: "")
                    )
                ]
            )
            .focused($focusedTextfield, equals: .password)
            .onSubmit { login() }
            Button(action: login) {
                Text("Login")
                    .bold()
                    .foregroundStyle(formIsValid ? Color.accentColor : Color.secondary)
            }
            .disabled(!formIsValid)
            .ktakeWidthEagerly(alignment: .trailing)
        }
        .disabled(isLogingIn)
        .navigationTitle(Text("Davs"))
    }

    private var formIsValid: Bool {
        usernameError?.valid == true && passwordError?.valid == true
    }

    private func login() {
        guard formIsValid else { return }

        Task { await withIsLogingIn {
            let result = await authentication.login(username: username, password: password) }
            #warning("DO SOMETHING WITH RESULT")
        }
    }

    private func withIsLogingIn(_ callback: () async -> Void) async {
        isLogingIn = true
        await callback()
        isLogingIn = false
    }
}

private enum FocusFields {
    case username
    case password
}

#Preview {
    NavigationStack {
        LoginScreen()
    }
    .authenticationEnvironment(authentication: Authentication())
}
