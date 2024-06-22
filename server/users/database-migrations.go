package users

import "gorm.io/gorm"

func MigrationStrategyForUser(db *gorm.DB) error {
	err := db.AutoMigrate(&User{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&Contact{})
	if err != nil {
		return err
	}

	return nil
}
