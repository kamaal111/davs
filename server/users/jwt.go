package users

import (
	"errors"
	"fmt"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kamaal111/davs/utils"
)

func signUserToken(user User) (string, error) {
	environment := utils.GetEnvironment()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		// Valid for 30 days
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	return token.SignedString([]byte(environment.JWTSecret))
}

func verifyUserToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		_, ok := token.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			algorithm := token.Header["alg"]
			log.Printf("Detected unexpected signing method: %v", algorithm)
			return nil, fmt.Errorf("unexpected signing method: %v", algorithm)
		}

		environment := utils.GetEnvironment()
		return []byte(environment.JWTSecret), nil
	})
	if err != nil || !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("invalid token")
	}

	if float64(time.Now().Unix()) > claims["exp"].(float64) {
		return nil, errors.New("expired token")
	}

	return claims, nil
}
