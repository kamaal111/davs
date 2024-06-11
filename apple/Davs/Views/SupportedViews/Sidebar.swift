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
        Text("Sidebar")
            #if os(macOS)
            .navigationSplitViewColumnWidth(min: minWidth, ideal: idealWidth)
            #endif
    }
}

#Preview {
    Sidebar()
}
