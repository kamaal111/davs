//
//  SignUpScreen.swift
//
//
//  Created by Kamaal M Farah on 06/07/2024.
//

import DavsUI
import SwiftUI
import KamaalUI
import KamaalPopUp
import SwiftValidator

struct SignUpScreen: View {
    @Environment(Authentication.self) private var authentication
    @EnvironmentObject private var popUpManager: KPopUpManager

    @State private var username = ""
    @State private var usernameError: (valid: Bool, message: String?)?
    @State private var password = ""
    @State private var passwordError: (valid: Bool, message: String?)?
    @State private var verificationPassword = ""
    @State private var verificationPasswordError: (valid: Bool, message: String?)?
    @State private var isSigningUp = false

    @FocusState private var focusedTextfield: FocusFields?

    @Binding var isShown: Bool

    var body: some View {
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
                        message: NSLocalizedString("Username should be at least 1 character long", comment: "")
                    )
                ]
            )
            .focused($focusedTextfield, equals: .username)
            .onSubmit(signUp)
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
                        message: NSLocalizedString("Password should be at least 5 characters long", comment: "")
                    )
                ]
            )
            .focused($focusedTextfield, equals: .password)
            .onSubmit(signUp)
            DavsTextField(
                value: $verificationPassword,
                errorResult: $verificationPasswordError,
                localizedLabel: "Verification Password",
                bundle: .module,
                variant: .secure,
                configration: DavsTextFieldConfiguration(capitalazation: .never),
                validations: [
                    .isSameAs(
                        value: password,
                        message:  NSLocalizedString(
                            "Verification password should be the same as the given password",
                            comment: ""
                        )
                    )
                ]
            )
            .focused($focusedTextfield, equals: .verificationPassword)
            .onSubmit(signUp)
            HStack {
                Button(action: navigateBack) {
                    Text("Login")
                        .bold()
                        .foregroundStyle(Color.accentColor)
                }
                .buttonStyle(.borderless)
                Spacer()
                Button(action: signUp) {
                    Text("Sign Up")
                        .bold()
                        .foregroundStyle(formIsValid ? Color.accentColor : Color.secondary)
                }
                .buttonStyle(.borderless)
                .disabled(!formIsValid)
            }
        }
        .disabled(isSigningUp)
        .navigationTitle(Text("Sign Up"))
    }

    private var formIsValid: Bool {
        let errorResults: [(valid: Bool, message: String?)?] = [
            usernameError,
            passwordError,
            verificationPasswordError,
        ]
        return errorResults
            .allSatisfy({ result in result?.valid == true })
    }

    private func signUp() {
        guard formIsValid else { return }

        Task {
            await withIsSigningUp {
                let result = await authentication.signUp(username: username, password: password)
                switch result {
                case .failure(let failure): handleSignUpFailure(failure)
                case .success: popUpManager.hidePopUp()
                }
            }
        }
    }

    private func navigateBack() {
        isShown = false
    }

    private func handleSignUpFailure(_ failure: SignUpErrors) {
        switch failure {
        case .invalidCredentials:
            popUpManager.showPopUp(style: .bottom(
                title: NSLocalizedString("Invalid credentials provided", comment: ""),
                type: .error,
                description: nil
            ))
        case .userAlreadyExists:
            popUpManager.showPopUp(style: .bottom(
                title: NSLocalizedString("User already exists, do you prefer to login?", comment: ""),
                type: .error,
                description: nil
            ))
        case .generalFailure:
            popUpManager.showPopUp(style: .bottom(
                title: NSLocalizedString("Something went wrong", comment: ""),
                type: .error,
                description: nil
            ))
        }
    }

    private func withIsSigningUp(_ callback: () async -> Void) async {
        isSigningUp = true
        await callback()
        isSigningUp = false
    }
}

private enum FocusFields {
    case username
    case password
    case verificationPassword
}

#Preview {
    NavigationStack {
        SignUpScreen(isShown: .constant(true))
    }
    .authenticationEnvironment(authentication: Authentication())
}
