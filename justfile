# List available commands
default:
    just --list --unsorted --list-heading $'Available commands\n'

run-server:
    just server/build-run

build-server:
    just server/build

run-dev-server:
    just server/run-dev

run-dev-web:
    just web/run-dev

build-web-locales:
    just web/build-locales

format-js:
    #!/bin/zsh

    bun run format

lint-staged:
    #!/bin/zsh

    bun run lint-staged

lint-js:
    #!/bin/zsh

    bun run lint

bootstrap:
    #!/bin/zsh

    bun i
    just server/bootstrap
    just web/bootstrap
