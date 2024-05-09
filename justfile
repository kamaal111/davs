set export
set dotenv-load

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
    export MINIO_ENDPOINT="host.docker.internal:9000"

    reflex -r "\.go" -s -- sh -c "go run *.go"

# Go mod tidy
go-mod-tidy:
    go mod tidy

# Generate Open API Specs
generate-spec: format-spec-comments
    #!/bin/zsh

    swag init -g main.go
    just fix-generated-spec

[private]
fix-generated-spec:
    #!/bin/zsh

    files_to_update=(
        ./docs/docs.go
        ./docs/swagger.json
        ./docs/swagger.yaml
    )
    for file in $files_to_update;
    do
        sed -i "s/x-nullable/nullable/g" $file
        sed -i "s/x-omitempty/omitempty/g" $file
        echo "Fixed $file"
    done

[private]
format-spec-comments:
    swag fmt

[private]
stop-and-remove-container:
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
