package users

import (
	"errors"

	"gorm.io/gorm"
)

const minimumNameLength = 1

var ErrAddressBookNameIsTooShort = errors.New("name of address book too short")

type AddressBook struct {
	gorm.Model
	// Look up name
	Name string `gorm:"not null;index:idx_user_name,unique"`
	// Associated user id the contact belongs to
	UserID uint `gorm:"not null;index:idx_user_name,unique"`
}

func GetOrCreateAddressBook(db *gorm.DB) func(user User, name string) (*AddressBook, error) {
	return func(user User, name string) (*AddressBook, error) {
		if len(name) < minimumNameLength {
			return nil, ErrAddressBookNameIsTooShort
		}

		addressBook := AddressBook{Name: name, UserID: user.ID}
		result := db.Take(&addressBook, "user_id = ? AND name = ?", user.ID, name)
		if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, result.Error
		} else {
			db.Create(&addressBook)
		}

		return &addressBook, nil
	}
}
