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
	Name string `gorm:"not null;index:idx_name,unique"`
	// Associated user id the contact belongs to
	UserID uint `gorm:"not null;index:idx_name,unique"`
}

func (contact *Contact) GetEtag() string {
	return fmt.Sprintf("%d-%d", contact.ID, contact.UpdatedAt.Unix())
}

func CreateOrUpdateContactCard(db *gorm.DB) func(user User, name string) func(card []byte) (*Contact, bool, error) {
	return func(user User, name string) func(card []byte) (*Contact, bool, error) {
		contact, err := getContactByUserIDAndName(db)(user, name)
		userDoesNotExist := err == errContactDoesNotExist
		if err != nil && !userDoesNotExist {
			return func(card []byte) (*Contact, bool, error) {
				return nil, false, err
			}
		}

		return func(card []byte) (*Contact, bool, error) {
			if userDoesNotExist {
				createdContact := createContact(db)(user, card, name)
				return &createdContact, true, nil
			}

			updatedContact := updateContactCard(db)(*contact, card)
			return &updatedContact, false, nil
		}
	}
}

func createContact(db *gorm.DB) func(user User, card []byte, name string) Contact {
	return func(user User, card []byte, name string) Contact {
		contact := Contact{Card: card, Name: name, UserID: user.ID}
		db.Create(&contact)

		return contact
	}
}

func updateContactCard(db *gorm.DB) func(contact Contact, card []byte) Contact {
	return func(contact Contact, card []byte) Contact {
		db.Model(&contact).Update("card", card)

		return contact
	}
}

func getContactByUserIDAndName(db *gorm.DB) func(user User, name string) (*Contact, error) {
	return func(user User, name string) (*Contact, error) {
		var contact Contact
		result := db.Take(&contact, "user_id = ? AND name = ?", user.ID, name)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errContactDoesNotExist
		}

		return &contact, nil
	}

}
