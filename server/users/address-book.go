package users

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
)

const ROOT_ADDRESS_BOOK_NAME = "contacts"

const minimumAddressBookNameLength = 1
const maximumAddressBookNameLength = 48

var ErrAddressBookNameIsTooShort = errors.New("name of address book too short")
var ErrAddressBookNameIsTooLong = errors.New("name of address book too long")
var ErrInvalidCharacterInAddressBookName = errors.New("invalid characters in address book name")

var invalidAddressBookNameCharacters = []rune{
	'/', '\\', ' ', ';',
}

type AddressBook struct {
	gorm.Model
	// Look up name
	Name string `gorm:"type:varchar(48);not null;index:idx_user_name,unique"`
	// Associated user id the contact belongs to
	UserID uint `gorm:"not null;index:idx_user_name,unique"`
	// Display name of the address book
	DisplayName *string
}

func (addressBook *AddressBook) Path() string {
	return fmt.Sprintf("/addressbooks/%s/", addressBook.Name)
}

func GetOrCreateRootAddressBook(db *gorm.DB) func(user User) (*AddressBook, error) {
	return func(user User) (*AddressBook, error) {
		return GetOrCreateAddressBook(db)(user, ROOT_ADDRESS_BOOK_NAME)
	}
}

func GetOrCreateAddressBook(db *gorm.DB) func(user User, name string) (*AddressBook, error) {
	return func(user User, name string) (*AddressBook, error) {
		if len(name) < minimumAddressBookNameLength {
			return nil, ErrAddressBookNameIsTooShort
		}

		if len(name) > maximumAddressBookNameLength {
			return nil, ErrAddressBookNameIsTooLong
		}

		for _, character := range name {
			for _, invalidCharacter := range invalidAddressBookNameCharacters {
				if character == invalidCharacter {
					return nil, ErrInvalidCharacterInAddressBookName
				}
			}
		}

		addressBook := AddressBook{Name: name, UserID: user.ID}
		result := db.Take(&addressBook, "user_id = ? AND name = ?", user.ID, name)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			db.Create(&addressBook)
			return &addressBook, nil
		}

		return &addressBook, nil
	}
}
