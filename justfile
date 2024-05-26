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
