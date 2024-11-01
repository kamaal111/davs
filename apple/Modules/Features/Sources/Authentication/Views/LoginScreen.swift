//
//  LoginScreen.swift
//
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import DavsUI
import SwiftUI
import KamaalUI
import KamaalPopUp
import SwiftValidator

struct LoginScreen: View {
    @Environment(Authentication.self) private var authentication
    @EnvironmentObject private var popUpManager: KPopUpManager

    @State private var username = ""
    @State private var usernameError: (valid: Bool, message: String?)?
    @State private var password = ""
    @State private var passwordError: (valid: Bool, message: String?)?
    @State private var isLogingIn = false
    @State private var signUpScreenIsShown = false

    @FocusState private var focusedTextfield: FocusFields?

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
            .onSubmit(login)
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
            .onSubmit(login)
            HStack {
                Button(action: navigateToSignUp) {
                    Text("Sign Up")
                        .bold()
                        .foregroundStyle(Color.accentColor)
                }
                .buttonStyle(.borderless)
                Spacer()
                Button(action: login) {
                    Text("Login")
                        .bold()
                        .foregroundStyle(formIsValid ? Color.accentColor : Color.secondary)
                }
                .buttonStyle(.borderless)
                .disabled(!formIsValid)
            }
        }
        .disabled(isLogingIn)
        .navigationTitle(Text("Login"))
        .navigationDestination(isPresented: $signUpScreenIsShown) { SignUpScreen(isShown: $signUpScreenIsShown) }
    }

    private var formIsValid: Bool {
        let errorResults: [(valid: Bool, message: String?)?] = [
            usernameError,
            passwordError,
        ]
        return errorResults
            .allSatisfy({ result in result?.valid == true })
    }

    private func login() {
        guard formIsValid else { return }

        Task {
            await withIsLogingIn {
                let result = await authentication.login(username: username, password: password)
                switch result {
                case .failure(let failure): handleLoginFailure(failure)
                case .success: popUpManager.hidePopUp()
                }
            }
        }
    }

    private func navigateToSignUp() {
        signUpScreenIsShown = true
    }

    private func handleLoginFailure(_ failure: LoginErrors) {
        switch failure {
        case .invalidCredentials:
            popUpManager.showPopUp(style: .bottom(
                title: NSLocalizedString("Invalid login credentials provided", comment: ""),
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
