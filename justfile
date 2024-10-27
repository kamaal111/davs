# List available commands
default:
    just --list --unsorted

# Run Davs server
run-server:
    just server/build-run

# Build Davs server
build-server:
    just server/build

# Run Davs server in dev mode
run-dev-server:
    just server/run-dev

# Start services such as databases
start-services:
    docker compose -f docker/docker-compose.services.yml up --detach

# Stop services
stop-services:
    docker compose -f docker/docker-compose.services.yml down

# Run web server in dev mode
run-dev-web:
    just web/run-dev

# Test Davs server
test-server:
    just server/test

# Test web
test-web:
    just web/test

# Run all tests
test: test-web test-server

# Check for quility checks
quality:
    just web/quality

# Format all
format:
    just web/format

# Build locales
build-web-locales:
    just web/build-locales

# Prepare project for development
prepare: install-modules
    just server/prepare
    just web/prepare

# Bootstap project
bootstrap: install-pnpm prepare
    just server/bootstrap
    just web/bootstrap

[private]
install-modules:
    npm i

[private]
install-pnpm:
    #!/bin/zsh

    echo Y | npm install -g pnpm@9.7.1
    echo "Installed PNPM"
