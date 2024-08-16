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

run-dev-web:
    just web/run-dev

test-server:
    just server/test

test-web:
    just web/test

test: test-web test-server

build-web-locales:
    just web/build-locales

format-js:
    #!/bin/zsh

    npm run format

lint-js:
    #!/bin/zsh

    npm run lint

typecheck-js:
    #!/bin/zsh

    just web/typecheck    

bootstrap:
    #!/bin/zsh

    npm i
    just server/bootstrap
    just web/bootstrap
