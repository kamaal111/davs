# List available commands
default:
    just --list --unsorted --list-heading $'Available commands\n'

run-server:
    just server/build-run

build-server:
    just server/build

run-dev-server:
    just server/run-dev
