package storage

import (
	"github.com/kamaal111/davs/users"
	"gorm.io/gorm"
)

func initializeMigrations(db *gorm.DB) error {
	err := users.MigrationStrategyForUser(db)
	if err != nil {
		return err
	}

	return nil
}
