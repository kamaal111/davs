// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Features",
    defaultLocalization: "en",
    platforms: [.macOS(.v15), .iOS(.v18)],
    products: [
        .library(
            name: "DavsContacts",
            targets: ["DavsContacts"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Kamaalio/KamaalSwift.git", .upToNextMajor(from: "2.3.1")),
    ],
    targets: [
        .target(
            name: "DavsContacts",
            dependencies: [
                .product(name: "KamaalUI", package: "KamaalSwift"),
            ]
        ),
        .testTarget(
            name: "DavsContactsTests",
            dependencies: ["DavsContacts"]
        ),
    ]
)
