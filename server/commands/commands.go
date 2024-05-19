package commands

import (
	"github.com/kamaal111/davs/server"
	"github.com/spf13/cobra"
)

func Execute() error {
	var davsCommand = &cobra.Command{Use: "davs", Short: "DAVS Commands"}
	davsCommand.AddCommand(server.RunServerCommand())
	davsCommand.AddCommand(generateAPIKeyCommand())

	return davsCommand.Execute()
}
