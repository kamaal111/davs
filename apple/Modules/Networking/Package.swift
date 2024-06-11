// swift-tools-version: 6.0
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "Networking",
    platforms: [.macOS(.v15), .iOS(.v18)],
    products: [
        .library(name: "DavsClient", targets: ["DavsClient"]),
    ],
    dependencies: [
        .package(url: "https://github.com/Kamaalio/KamaalSwift.git", .upToNextMajor(from: "2.3.1")),
    ],
    targets: [
        .target(
            name: "DavsClient",
            dependencies: [
                .product(name: "KamaalUtils", package: "KamaalSwift"),
            ],
            resources: [.process("Internals/Resources")]
        ),
        .testTarget(name: "DavsClientTests", dependencies: ["DavsClient"]),
    ]
)
