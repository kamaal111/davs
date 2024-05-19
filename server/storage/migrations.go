package storage

import (
	"github.com/kamaal111/davs/users"
	"gorm.io/gorm"
)

func initializeMigrations(db *gorm.DB) error {
	err := users.MigrationStrategyForUser(db)

	return err
}
