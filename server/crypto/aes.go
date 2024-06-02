package crypto

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
)

func AESDecrypt(key []byte, payload []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	splittenPayload := strings.Split(string(payload), ":")
	if len(splittenPayload) != 2 {
		return nil, errors.New("invalid encrypted payload")
	}

	iv := []byte(splittenPayload[0])
	blockMode := cipher.NewCBCDecrypter(block, iv)

	message, err := base64.StdEncoding.DecodeString(splittenPayload[1])
	if err != nil {
		return nil, err
	}

	originalData := make([]byte, len(message))
	blockMode.CryptBlocks(originalData, message)
	originalData = pkcs5UnPadding(originalData)

	return originalData, nil
}

func AESEncrypt(key []byte, originalData []byte) (string, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	blockSize := block.BlockSize()
	originalData = pkcs5Padding(originalData, blockSize)
	iv := make([]byte, 16)
	rand.Read(iv)
	blockMode := cipher.NewCBCEncrypter(block, iv)
	encryptedMessage := make([]byte, len(originalData))
	blockMode.CryptBlocks(encryptedMessage, originalData)
	encodedEncryptedMessage := base64.StdEncoding.EncodeToString(encryptedMessage)
	encryptedMessageWithIV := fmt.Sprintf("%s:%s", iv, encodedEncryptedMessage)

	return encryptedMessageWithIV, nil
}

func pkcs5Padding(cipherText []byte, blockSize int) []byte {
	padding := blockSize - len(cipherText)%blockSize
	paddedText := bytes.Repeat([]byte{byte(padding)}, padding)

	return append(cipherText, paddedText...)
}

func pkcs5UnPadding(originalData []byte) []byte {
	length := len(originalData)
	unpadding := int(originalData[length-1])

	return originalData[:(length - unpadding)]
}
