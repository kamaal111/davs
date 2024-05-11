package main

import (
	"log"

	"github.com/kamaal111/davs/router"
	"github.com/kamaal111/davs/storage"
)

// @title			DAVS API
// @version		1.0
// @description	API for DAVS
//
// @license.name	MIT
// @license.url	https://github.com/kamaal111/davs/blob/main/LICENSE
//
// @BasePath		/api/v1
func main() {
	db, err := storage.Connect()
	if err != nil {
		log.Fatalln(err)
	}

	router.Start(db)
}
