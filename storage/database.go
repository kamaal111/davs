package storage

import (
	"errors"
	"fmt"
	"os"

	"github.com/Kamaalio/kamaalgo/strings"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const DATABASE_TIMEZONE = "Europe/Amsterdam"
const DATABASE_NAME = "davs_db"

func Connect() (*gorm.DB, error) {
	dsn, err := getDSN()
	if err != nil {
		return nil, err
	}

	configuration := gorm.Config{}
	db, err := gorm.Open(postgres.Open(*dsn), &configuration)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func getDSN() (*string, error) {
	variables, err := getDSNVariables()
	if err != nil {
		return nil, err
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
		variables.Host,
		variables.User,
		variables.Password,
		DATABASE_NAME,
		variables.Port,
		variables.SSLMode,
		DATABASE_TIMEZONE,
	)

	return &dsn, nil
}

type dsnVariables struct {
	Host     string
	User     string
	Password string
	Port     string
	SSLMode  string
}

func getDSNVariables() (*dsnVariables, error) {
	databaseHost, err := strings.Unwrap(os.Getenv("DATABASE_HOST"))
	if err != nil {
		return nil, errors.New("DATABASE_HOST undefined")
	}

	databaseUser, err := strings.Unwrap(os.Getenv("DATABASE_USER"))
	if err != nil {
		return nil, errors.New("DATABASE_USER undefined")
	}

	databasePassword, err := strings.Unwrap(os.Getenv("DATABASE_PASSWORD"))
	if err != nil {
		return nil, errors.New("DATABASE_PASSWORD undefined")
	}

	databasePort, err := strings.Unwrap(os.Getenv("DATABASE_PORT"))
	if err != nil {
		return nil, errors.New("DATABASE_PORT undefined")
	}

	databaseSSLMode, err := strings.Unwrap(os.Getenv("DATABASE_SSLMODE"))
	if err != nil {
		return nil, errors.New("DATABASE_SSLMODE undefined")
	}

	return &dsnVariables{
		Host:     databaseHost,
		User:     databaseUser,
		Password: databasePassword,
		Port:     databasePort,
		SSLMode:  databaseSSLMode,
	}, nil
}
