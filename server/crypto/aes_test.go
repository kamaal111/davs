package crypto_test

import (
	"testing"

	"github.com/kamaal111/davs/crypto"
)

func TestAESDecrypt(t *testing.T) {
	key := []byte("secret-iv-123456")
	data, err := crypto.AESDecrypt(key, []byte("1865af9dfd8f2e31:1AoGRjV8CHCVr8IPcFHCTw=="))
	if err != nil {
		t.Errorf("Result was incorrect, got: %v, want: %v.", err, nil)
		return
	}

	expectedString := "secret"
	if string(data) != expectedString {
		t.Errorf("Result was incorrect, got: %s, want: %s.", string(data), expectedString)
	}
}

func TestAESDecryptJSON(t *testing.T) {
	key := []byte("super_secret-123")
	data, err := crypto.AESDecrypt(key, []byte("94932af09924bbc1:ckshiaNdsAd5ubdABTXJ9XUIXY+BbrF9TuVgZvvO5Sw="))
	if err != nil {
		t.Errorf("Result was incorrect, got: %v, want: %v.", err, nil)
		return
	}

	expectedString := "{\"message\":\"test\"}"
	if string(data) != expectedString {
		t.Errorf("Result was incorrect, got: %s, want: %s.", string(data), expectedString)
	}
}

func TestAESDecryptFromEncrypted(t *testing.T) {
	key := []byte("secret-key-12345")
	rawMessage := "encrypted"
	data, err := crypto.AESEncrypt(key, []byte(rawMessage))
	if err != nil {
		t.Errorf("Result was incorrect, got: %v, want: %v.", err, nil)
		return
	}

	decrypted, err := crypto.AESDecrypt(key, []byte(data))
	if err != nil {
		t.Errorf("Result was incorrect, got: %v, want: %v.", err, nil)
		return
	}

	if string(decrypted) != rawMessage {
		t.Errorf("Result was incorrect, got: %s, want: %s.", string(decrypted), rawMessage)
	}
}
