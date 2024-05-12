package commands

import (
	cryptoRand "crypto/rand"
	"encoding/hex"
	"fmt"

	"github.com/spf13/cobra"
)

func generateAPIKeyCommand() *cobra.Command {
	var command = &cobra.Command{
		Use:   "gen-api-key",
		Short: "Generate a API key and print to terminal",
		RunE: func(cmd *cobra.Command, args []string) error {
			apiKeyBytes := make([]byte, 32)
			_, err := cryptoRand.Read(apiKeyBytes)
			if err != nil {
				return err
			}

			apiKey := hex.EncodeToString(apiKeyBytes)
			fmt.Printf("API key: %s\n", apiKey)
			return nil
		},
	}

	return command
}
