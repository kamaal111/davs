set export

PORT := "8000"
CONTAINER_NAME := "davs"

# List available commands
default:
    just --list --unsorted --list-heading $'Available commands\n'

# Run main Docker container
run: stop-and-remove-container
    docker run -dp $PORT:$PORT --name $CONTAINER_NAME \
        -e PORT=$PORT -e GIN_MODE="release" \
        $CONTAINER_NAME

# Build main Docker container
build:
    docker build -t $CONTAINER_NAME .

# Build and run main Docker container
build-run: build run

# Run application in dev mode
run-dev:
    #!/bin/zsh

    export SERVER_ADDRESS="127.0.0.1:$PORT"
    export GIN_MODE="debug"

    reflex -r "\.go" -s -- sh -c "go run src/*.go"

[private]
stop-and-remove-container:
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
