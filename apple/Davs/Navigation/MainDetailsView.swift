//
//  MainDetailsView.swift
//  Davs
//
//  Created by Kamaal M Farah on 21/06/2024.
//

import SwiftUI
import KamaalPopUp
import DavsContacts

struct MainDetailsView: View {
    @StateObject private var popUpManager = KPopUpManager()

    var body: some View {
        NavigationStack {
            ContactsScreen()
                .withKPopUp(popUpManager)
        }
    }
}

#Preview {
    MainDetailsView()
}
