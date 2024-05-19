package users

import (
	"errors"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var errUserExists = errors.New("User already exists")
var errDoesNotExist = errors.New("User does not exist")
var errWrongPassword = errors.New("wrong password")
var errInvalidUserPayload = errors.New("invalid user payload")

var invalidUserCharacters = []string{
	":",
}

type User struct {
	gorm.Model
	Username string `gorm:"not null"`
	Password string `gorm:"not null"`
}

func (user *User) create(db *gorm.DB) error {
	for _, invalidCharacter := range invalidUserCharacters {
		if strings.Contains(user.Username, invalidCharacter) || strings.Contains(user.Password, invalidCharacter) {
			return errInvalidUserPayload
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

func (user *User) Login(db *gorm.DB) func(password string) error {
	return func(password string) error {
		_, err := user.getByUsername(db)
		if err != nil {
			return err
		}

		err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
		if err != nil {
			return errWrongPassword
		}

		return nil
	}
}

func (user *User) getByUsername(db *gorm.DB) (*gorm.DB, error) {
	result := db.Take(user, "username = ?", user.Username)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result, errDoesNotExist
	}

	return result, nil
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

func MigrationStrategyForUser(db *gorm.DB) error {
	err := db.AutoMigrate(&User{})

	return err
}
