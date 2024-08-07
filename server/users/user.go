package users

import (
	"errors"
	"fmt"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var errUserExists = errors.New("User already exists")
var errDoesNotExist = errors.New("User does not exist")
var errWrongPassword = errors.New("wrong password")
var errInvalidUserPayload = errors.New("invalid user payload")

var invalidUserCharacters = []rune{
	':', '/', '\\', ' ',
}

type User struct {
	gorm.Model
	Username     string        `gorm:"index:,unique;not null"`
	Password     string        `gorm:"not null"`
	AddressBooks []AddressBook `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
}

func (user *User) UsersPrincipals() string {
	return fmt.Sprintf("/principals/users/%s/", user.Username)
}

func (user *User) create(db *gorm.DB) error {
	combinedUserValues := user.Username + user.Password
	for _, character := range combinedUserValues {
		for _, invalidCharacter := range invalidUserCharacters {
			if character == invalidCharacter {
				return errInvalidUserPayload
			}
		}
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.MinCost)
	if err != nil {
		return err
	}

	existingUserResult := db.Take(&User{}, "username = ?", user.Username)
	if !errors.Is(existingUserResult.Error, gorm.ErrRecordNotFound) {
		return errUserExists
	}

	user.Password = string(hashedPassword)
	db.Create(user)

	return nil
}

func (user *User) Login(db *gorm.DB) func(password string) (*User, error) {
	return func(password string) (*User, error) {
		fetchedUser, err := getUserByUsername(db)(user.Username)
		if err != nil {
			return nil, err
		}

		err = bcrypt.CompareHashAndPassword([]byte(fetchedUser.Password), []byte(password))
		if err != nil {
			return nil, errWrongPassword
		}

		return fetchedUser, nil
	}
}

func getUserByUsername(db *gorm.DB) func(username string) (*User, error) {
	return func(username string) (*User, error) {
		var user User
		result := db.Take(&user, "username = ?", username)
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, errDoesNotExist
		}

		return &user, nil
	}

}

func getUserByID(db *gorm.DB) func(id string) *User {
	return func(id string) *User {
		var user User
		result := db.Take(&user, id)
		if result.Error != nil {
			return nil
		}

		return &user
	}

}

func GetUserFromContext(context *gin.Context) *User {
	userInContext, loggedIn := context.Get("user")
	if !loggedIn {
		return nil
	}

	convertedUser, isValid := userInContext.(User)
	if !isValid {
		return nil
	}

	return &convertedUser
}
