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

lint-js:
    #!/bin/zsh

    bun run lint

typecheck-js:
    #!/bin/zsh

    just web/typecheck    

bootstrap:
    #!/bin/zsh

    BUN_INSTALL="$HOME/.bun"
    PATH=$BUN_INSTALL/bin:$PATH

    bun i
    just server/bootstrap
    just web/bootstrap
