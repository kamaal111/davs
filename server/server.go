package server

import (
	"github.com/kamaal111/davs/router"
	"github.com/kamaal111/davs/storage"
)

func run(args []string) error {
	db, err := storage.Connect()
	if err != nil {
		return err
	}

	router.Start(db)
	return nil
}
