package users

import (
	"errors"
	"fmt"

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

func (contact *Contact) GetEtag() string {
	return fmt.Sprintf("%d-%d", contact.ID, contact.UpdatedAt.Unix())
}

func CreateContact(db *gorm.DB) func(user User, card []byte, name string) Contact {
	return func(user User, card []byte, name string) Contact {
		contact := Contact{Card: card, Name: name, UserID: user.ID}
		db.Create(&contact)

		return contact
	}
}

func UpdateContactCard(db *gorm.DB) func(contact Contact, card []byte) Contact {
	return func(contact Contact, card []byte) Contact {
		// TODO: ACTUALLY UPDATE
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
