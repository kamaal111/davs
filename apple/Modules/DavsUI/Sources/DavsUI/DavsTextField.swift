//
//  DavsTextField.swift
//
//
//  Created by Kamaal M Farah on 16/06/2024.
//

import SwiftUI
import KamaalUI
import SwiftValidator

@usableFromInline
let DEFAULT_DAVS_TEXT_FIELD_VARIANT: DavsTextFieldVariants = .text

private let ANIMATION_INTERPOLATION_TIME = 0.5

#if os(macOS)
public enum TextInputAutocapitalization {
    case never
}
#endif

public enum DavsTextFieldVariants {
    case text
    case secure
}

public enum DavsTextFieldValidationRules {
    case minimumLength(length: Int, message: String?)
}

public struct DavsTextFieldConfiguration {
    public let capitalazation: TextInputAutocapitalization?
    public let bordered: Bool

    public init(capitalazation: TextInputAutocapitalization? = nil, bordered: Bool = false) {
        self.capitalazation = capitalazation
        self.bordered = bordered
    }
}

public struct DavsTextField: View {
    @State private var labelAnimationValue: LabelAnimationValues = .inactive
    @State private var showPassword = false

    @FocusState private var isFocused: Bool

    @Binding var value: String
    @Binding var errorResult: (valid: Bool, message: String?)?

    let labelText: String
    let variant: DavsTextFieldVariants
    let configration: DavsTextFieldConfiguration
    let validations: [any StringValidatableRule]

    fileprivate init(
        value: Binding<String>,
        errorResult: Binding<(valid: Bool, message: String?)?>,
        label: String,
        variant: DavsTextFieldVariants,
        configration: DavsTextFieldConfiguration,
        validations: [DavsTextFieldValidationRules]
    ) {
        self._value = value
        self._errorResult = errorResult
        self.labelText = label
        self.variant = variant
        self.configration = configration
        self.validations = validations.map({ validation -> any StringValidatableRule in
            switch validation {
            case let .minimumLength(length, message):
                StringValidateMinimumLength(length: length, message: message)
            }
        })
    }

    public init(
        value: Binding<String>,
        errorResult: Binding<(valid: Bool, message: String?)?>,
        localizedLabel: LocalizedStringResource,
        bundle: Bundle,
        variant: DavsTextFieldVariants = DEFAULT_DAVS_TEXT_FIELD_VARIANT,
        configration: DavsTextFieldConfiguration = .init(),
        validations: [DavsTextFieldValidationRules]
    ) {
        self.init(
            value: value,
            errorResult: errorResult,
            label: NSLocalizedString(localizedLabel.key, bundle: bundle, comment: ""),
            variant: variant,
            configration: configration,
            validations: validations
        )
    }

    public init(
        value: Binding<String>,
        localizedLabel: LocalizedStringResource,
        bundle: Bundle,
        variant: DavsTextFieldVariants = DEFAULT_DAVS_TEXT_FIELD_VARIANT,
        configration: DavsTextFieldConfiguration = .init()
    ) {
        self.init(
            value: value,
            errorResult: .constant(nil),
            label: NSLocalizedString(localizedLabel.key, bundle: bundle, comment: ""),
            variant: variant,
            configration: configration,
            validations: []
        )
    }

    public var body: some View {
        ZStack(alignment: .leading) {
            DavsTextFieldLabel(
                showError: showError,
                labelText: labelText,
                labelAnimationValue: labelAnimationValue
            )
            DavsTextFieldTextField(
                value: $value,
                showPassword: $showPassword,
                error: textFieldError,
                variant: variant,
                configration: configration
            )
            .focused($isFocused)
        }
        .padding(.vertical, 8)
        #if !os(macOS)
        .applyIf(configration.bordered, transformation: { view in
            view
                .padding()
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(.secondary.opacity(0.5), lineWidth: 1)
                )
        })
        #endif
        .animation(.spring(response: ANIMATION_INTERPOLATION_TIME), value: labelAnimationValue)
        .onChange(of: value) { oldValue, newValue in handleValueChange(value: newValue) }
        .onAppear { handleValueChange(value: value) }
    }

    private var validator: StringValidator {
        StringValidator(value: value, validators: validations)
    }

    private var showError: Bool {
         !isFocused && !value.isEmpty && errorResult?.valid != true
    }

    private var textFieldError: (show: Bool, message: String?) {
        guard showError else { return (false, nil) }

        return (true, errorResult?.message)
    }

    private func handleValueChange(value: String) {
        setErrorResult(value: value)
        setLabelAnimationValue(value: value)
    }

    private func setLabelAnimationValue(value: String) {
        let newLabelAnimationValue: LabelAnimationValues = if value.isEmpty { .inactive } else { .active }
        guard newLabelAnimationValue != labelAnimationValue else { return }

        labelAnimationValue = newLabelAnimationValue
    }

    private func setErrorResult(value: String) {
        let result = validator.result
        errorResult = (result.valid, result.message)
    }
}

private struct DavsTextFieldTextField: View {
    @Binding var value: String
    @Binding var showPassword: Bool

    let error: (show: Bool, message: String?)?
    let variant: DavsTextFieldVariants
    let configration: DavsTextFieldConfiguration

    var body: some View {
        VStack(alignment: .leading) {
            KJustStack {
                switch variant {
                case .text: TextField("", text: $value)
                case .secure:
                    HStack {
                        KJustStack {
                            if !showPassword {
                                SecureField("", text: $value)
                            } else {
                                TextField("", text: $value)
                            }
                        }
                        .ktakeWidthEagerly(alignment: .leading)
                        Image(systemName: !showPassword ? "eye" : "eye.slash")
                            .foregroundColor(error?.show == true ? Color.red : Color.accentColor)
                            .onTapGesture { handleShowPassword() }
                    }
                }
            }
            #if os(iOS)
            .textInputAutocapitalization(configration.capitalazation)
            #endif
            if error?.show == true, let errorMessage = error?.message {
                Text(errorMessage)
                    .font(.caption)
                    .foregroundStyle(.red)
                    #if os(macOS)
                    .padding(.horizontal, 12)
                    #endif
            }
        }
    }

    private func handleShowPassword() {
        showPassword.toggle()
    }
}

private struct DavsTextFieldLabel: View {
    let showError: Bool
    let labelText: String
    let labelAnimationValue: LabelAnimationValues

    var body: some View {
        Text(labelText)
            .font(.caption)
            .offset(x: labelAnimationValue.xOffset, y: labelAnimationValue.yOffset + (showError ? -8 : 0))
            .scaleEffect(labelAnimationValue.scale, anchor: .leading)
            .foregroundStyle(showError ? Color.red : Color.accentColor)
            .ktakeWidthEagerly(alignment: .leading)
            #if os(macOS)
            .padding(.horizontal, 12)
            #endif
    }
}

private enum LabelAnimationValues {
    case active
    case inactive

    var yOffset: CGFloat {
        switch self {
        case .inactive: 0
        case .active:
            #if os(macOS)
            -20
            #else
            -16
            #endif
        }
    }

    var xOffset: CGFloat {
        switch self {
        case .inactive: 0
        case .active:
            #if os(macOS)
            -4
            #else
            0
            #endif
        }
    }

    var scale: CGFloat {
        switch self {
        case .inactive: 1
        case .active:
            #if os(macOS)
            1
            #else
            1.25
            #endif
        }
    }
}

#Preview {
    DavsTextField(
        value: .constant("Kamaal"),
        errorResult: .constant(nil),
        label: "Name",
        variant: .text,
        configration: .init(),
        validations: []
    )
}
