set export
set dotenv-load

SERVER_PORT := "8000"
DATABASE_PORT := "5432"
CONTAINER_NAME := "davs"

# List available commands
default:
    just --list --unsorted --list-heading $'Available commands\n'

# Run main Docker container
run: stop-and-remove-container
    docker run -dp $SERVER_PORT:$SERVER_PORT --name $CONTAINER_NAME \
        -e SERVER_PORT=$SERVER_PORT -e GIN_MODE="release" \
        $CONTAINER_NAME

# Build main Docker container
build:
    docker build -t $CONTAINER_NAME .

# Build and run main Docker container
build-run: build run

# Run application in dev mode
run-dev:
    #!/bin/zsh

    export SERVER_ADDRESS="127.0.0.1:$SERVER_PORT"
    export GIN_MODE="debug"
    export DATABASE_HOST="davs-db"
    export DATABASE_USER="davs-user"
    export DATABASE_PASSWORD="secure-password"
    export DATABASE_SSLMODE="disable"

    reflex -r "\.go" -s -- sh -c "go run *.go run-server"

# Go mod tidy
go-mod-tidy:
    go mod tidy

# Generate Open API Specs
generate-spec: format-spec-comments
    #!/bin/zsh

    swag init -g main.go || exit 1
    just fix-generated-spec

# Generate a API key
generate-api-key:
    go run *.go gen-api-key

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
        echo "Fixed $file"
    done

[private]
format-spec-comments:
    swag fmt

[private]
stop-and-remove-container:
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
