//
//  Sidebar.swift
//  Davs
//
//  Created by Kamaal M Farah on 11/06/2024.
//

import SwiftUI

struct Sidebar: View {
    let minWidth: CGFloat
    let idealWidth: CGFloat

    private init(minWidth: CGFloat, idealWidth: CGFloat) {
        self.minWidth = minWidth
        self.idealWidth = idealWidth
    }

    init () {
        self.init(minWidth: 180, idealWidth: 200)
    }

    var body: some View {
        List {
            Section("Davs") {
                ForEach(Tabs.allCases) { tab in
                    Button(action: { }) {
                        Label(tab.title, systemImage: tab.imageSystemName)
                            .foregroundColor(.accentColor)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .navigationSplitViewColumnWidth(min: minWidth, ideal: idealWidth)
    }
}

#Preview {
    Sidebar()
}
