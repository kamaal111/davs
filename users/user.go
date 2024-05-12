package users

import (
	"log"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email    string `gorm:"not null"`
	Password string `gorm:"not null"`
}

func createUser(db *gorm.DB) func(user User) {
	return func(user User) {
		var existingUser *User
		db.First(existingUser, "email = ?", user.Email)
		if existingUser != nil {
			log.Fatalln("Oh noo", existingUser)
		}

		db.Create(&user)
	}
}

func MigrationStrategyForUser(db *gorm.DB) error {
	err := db.AutoMigrate(&User{})

	return err
}
