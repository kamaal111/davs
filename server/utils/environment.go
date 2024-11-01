package utils

import (
	"log"
	"os"

	"github.com/Kamaalio/kamaalgo/strings"
)

type Environment struct {
	JWTSecret     string
	APIKey        string
	ServerAddress string
	Port          string
	IsReleaseMode bool
}

func GetEnvironment() Environment {
	jwtSecret, err := strings.Unwrap(os.Getenv("JWT_SECRET"))
	if err != nil {
		log.Fatalln("JWT_SECRET not defined in .env")
	}

	apiKey, err := strings.Unwrap(os.Getenv("API_KEY"))
	if err != nil {
		log.Fatalln("API_KEY not defined in .env")
	}

	environment := Environment{
		JWTSecret:     jwtSecret,
		APIKey:        apiKey,
		ServerAddress: os.Getenv("SERVER_ADDRESS"),
		Port:          os.Getenv("PORT"),
		IsReleaseMode: os.Getenv("GIN_MODE") == "release",
	}
	return environment
}
