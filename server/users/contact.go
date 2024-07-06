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
	Name string `gorm:"not null;index:idx_address_book_name,unique"`
	// Associated address book id the contact belongs to
	AddressBookID uint `gorm:"not null;index:idx_address_book_name,unique"`
}

func (contact *Contact) GetEtag() string {
	return fmt.Sprintf("%d-%d", contact.ID, contact.UpdatedAt.Unix())
}

func CreateOrUpdateContactCard(db *gorm.DB) func(addressBook AddressBook, name string) func(card []byte) (*Contact, bool, error) {
	return func(addressBook AddressBook, name string) func(card []byte) (*Contact, bool, error) {
		contact, err := getContactByAddressBookIDAndName(db)(addressBook, name)
		userDoesNotExist := err == errContactDoesNotExist
		if err != nil && !userDoesNotExist {
			return func(card []byte) (*Contact, bool, error) {
				return nil, false, err
			}
		}

		return func(card []byte) (*Contact, bool, error) {
			if userDoesNotExist {
				createdContact := createContact(db)(addressBook, card, name)
				return &createdContact, true, nil
			}

			updatedContact := updateContactCard(db)(*contact, card)
			return &updatedContact, false, nil
		}
	}
}

func createContact(db *gorm.DB) func(addressBook AddressBook, card []byte, name string) Contact {
	return func(addressBook AddressBook, card []byte, name string) Contact {
		contact := Contact{Card: card, Name: name, AddressBookID: addressBook.ID}
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

func getContactByAddressBookIDAndName(db *gorm.DB) func(addressBook AddressBook, name string) (*Contact, error) {
	return func(addressBook AddressBook, name string) (*Contact, error) {
		var contact Contact
		result := db.Take(&contact, "address_book_id = ? AND name = ?", addressBook.ID, name)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errContactDoesNotExist
		}

		return &contact, nil
	}

}
