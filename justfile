# List available commands
default:
    just --list --unsorted --list-heading $'Available commands\n'

run-server:
    just server/build-run

build-server:
    just server/build

run-dev-server:
    just server/run-dev

start-services:
    docker compose -f docker/docker-compose.services.yml up --detach

stop-services:
    docker compose -f docker/docker-compose.services.yml down

run-dev-web:
    just web/run-dev

test-server:
    just server/test

test-web:
    just web/test

test: test-web test-server

lint:
    just web/lint

format:
    just web/format

build-web-locales:
    just web/build-locales

bootstrap:
    #!/bin/zsh

    npm i
    just server/bootstrap
    just web/bootstrap
