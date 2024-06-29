package users

import (
	"errors"

	"gorm.io/gorm"
)

var errContactDoesNotExist = errors.New("Contact does not exist")

type Contact struct {
	gorm.Model
	// VCard of contact
	Card []byte `gorm:"not null"`
	// Look up name
	Name string `gorm:"not null"`
	// Associated user id the contact belongs to
	UserID uint `gorm:"not null"`
}

func CreateContact(db *gorm.DB) func(user User, card string, name string) Contact {
	return func(user User, card, name string) Contact {
		contact := Contact{Card: []byte(card), Name: name, UserID: user.ID}
		db.Create(&contact)

		return contact
	}
}

func GetContactByUserIDAndName(db *gorm.DB) func(user User, name string) (*Contact, error) {
	return func(user User, name string) (*Contact, error) {
		var contact Contact
		result := db.Take(&contact, "user_id = ? AND name = ?", user.ID, name)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errContactDoesNotExist
		}

		return &contact, nil
	}

}
