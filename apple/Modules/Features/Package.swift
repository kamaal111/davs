// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Features",
    defaultLocalization: "en",
    platforms: [.macOS(.v15), .iOS(.v18)],
    products: [
        .library(name: "DavsContacts", targets: ["DavsContacts"]),
        .library(name: "Authentication", targets: ["Authentication"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Kamaalio/KamaalSwift.git", .upToNextMajor(from: "2.3.1")),
        .package(path: "../Networking"),
        .package(path: "../DavsUI"),
    ],
    targets: [
        .target(
            name: "DavsContacts",
            dependencies: [
                .product(name: "KamaalUI", package: "KamaalSwift"),
                .product(name: "KamaalExtensions", package: "KamaalSwift"),
                .product(name: "DavsClient", package: "Networking"),
                .product(name: "DavsUI", package: "DavsUI"),
            ]
        ),
        .testTarget(name: "DavsContactsTests", dependencies: ["DavsContacts"]),
        .target(
            name: "Authentication",
            dependencies: [
                .product(name: "DavsClient", package: "Networking"),
                .product(name: "DavsUI", package: "DavsUI"),
            ]
        ),
    ]
)
