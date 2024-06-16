// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "DavsUI",
    defaultLocalization: "en",
    platforms: [.macOS(.v15), .iOS(.v18)],
    products: [
        .library(name: "DavsUI", targets: ["DavsUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Kamaalio/KamaalSwift.git", .upToNextMajor(from: "2.3.1")),
        .package(path: "../swift-validator"),
    ],
    targets: [
        .target(
            name: "DavsUI",
            dependencies: [
                .product(name: "KamaalUI", package: "KamaalSwift"),
                .product(name: "SwiftValidator", package: "swift-validator"),
            ]
        ),
        .testTarget(name: "DavsUITests", dependencies: ["DavsUI"]),
    ]
)
