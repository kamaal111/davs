package users

import (
	"errors"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var errUserExists = errors.New("User already exists")

type User struct {
	gorm.Model
	Username string `gorm:"not null"`
	Password string `gorm:"not null"`
}

func createUser(db *gorm.DB) func(user User) error {
	return func(user User) error {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.MinCost)
		if err != nil {
			return err
		}

		existingUser := User{Username: user.Username}
		existingUserResult := db.Take(&existingUser)
		if !errors.Is(existingUserResult.Error, gorm.ErrRecordNotFound) {
			return errUserExists
		}

		user.Password = string(hashedPassword)
		db.Create(&user)

		return nil
	}
}

func MigrationStrategyForUser(db *gorm.DB) error {
	err := db.AutoMigrate(&User{})

	return err
}
