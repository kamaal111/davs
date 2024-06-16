//
//  DavsTextField.swift
//
//
//  Created by Kamaal M Farah on 16/06/2024.
//

import SwiftUI
import KamaalUI

@usableFromInline
let DEFAULT_DAVS_TEXT_FIELD_VARIANT: DavsTextFieldVariants = .text

private let ANIMATION_INTERPOLATION_TIME = 0.5

public enum DavsTextFieldVariants {
    case text
    case secure
}

public struct DavsTextFieldConfiguration {
    public let capitalazation: TextInputAutocapitalization?

    public init(capitalazation: TextInputAutocapitalization? = nil) {
        self.capitalazation = capitalazation
    }
}

public struct DavsTextField: View {
    @State private var labelAnimationValue: LabelAnimationValues = .inactive
    @State private var showPassword = false

    @Binding var value: String

    let labelText: String
    let variant: DavsTextFieldVariants
    let configration: DavsTextFieldConfiguration

    public init(
        value: Binding<String>,
        label: String,
        variant: DavsTextFieldVariants = DEFAULT_DAVS_TEXT_FIELD_VARIANT,
        configration: DavsTextFieldConfiguration = .init()
    ) {
        self._value = value
        self.labelText = label
        self.variant = variant
        self.configration = configration
    }

    public init(
        value: Binding<String>,
        localizedLabel: LocalizedStringResource,
        bundle: Bundle,
        comment: String = "",
        variant: DavsTextFieldVariants = DEFAULT_DAVS_TEXT_FIELD_VARIANT,
        configration: DavsTextFieldConfiguration = .init()
    ) {
        self.init(
            value: value,
            label: NSLocalizedString(localizedLabel.key, bundle: bundle, comment: comment),
            variant: variant,
            configration: configration
        )
    }

    public var body: some View {
        ZStack(alignment: .leading) {
            DavsTextFieldLabel(labelText: labelText, labelAnimationValue: labelAnimationValue)
            DavsTextFieldTextField(
                value: $value,
                showPassword: $showPassword,
                variant: variant,
                configration: configration
            )
        }
        .padding(.top, labelAnimationValue.padding)
        .animation(.spring(response: ANIMATION_INTERPOLATION_TIME), value: labelAnimationValue)
        .onChange(of: value) { oldValue, newValue in setLabelAnimationValue(value: newValue) }
        .onAppear { setLabelAnimationValue(value: value) }
    }

    private func setLabelAnimationValue(value: String) {
        let newLabelAnimationValue: LabelAnimationValues = if value.isEmpty { .inactive } else { .active }
        guard newLabelAnimationValue != labelAnimationValue else { return }

        labelAnimationValue = newLabelAnimationValue
    }
}

private struct DavsTextFieldTextField: View {
    @Binding var value: String
    @Binding var showPassword: Bool

    let variant: DavsTextFieldVariants
    let configration: DavsTextFieldConfiguration

    var body: some View {
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
                        .foregroundColor(Color.accentColor)
                        .onTapGesture { showPassword.toggle() }
                }
            }
        }
        .textInputAutocapitalization(configration.capitalazation)
    }
}

private struct DavsTextFieldLabel: View {
    let labelText: String
    let labelAnimationValue: LabelAnimationValues

    var body: some View {
        Text(labelText)
            .font(.caption)
            .offset(y: labelAnimationValue.offset)
            .scaleEffect(labelAnimationValue.scale, anchor: .leading)
            .foregroundStyle(Color.accentColor)
            .ktakeWidthEagerly(alignment: .leading)
    }
}

private enum LabelAnimationValues {
    case active
    case inactive

    var offset: CGFloat {
        switch self {
        case .inactive: 0
        case .active: -25
        }
    }

    var scale: CGFloat {
        switch self {
        case .inactive: 1
        case .active: 1.25
        }
    }

    var padding: CGFloat {
        switch self {
        case .inactive: 0
        case .active: 24
        }
    }
}

#Preview {
    DavsTextField(value: .constant("Kamaal"), label: "Name")
}
