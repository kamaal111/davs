package server

import (
	"github.com/spf13/cobra"
)

func RunServerCommand() *cobra.Command {
	var command = &cobra.Command{
		Use:   "run-server",
		Short: "Command to run the server",
		RunE: func(cmd *cobra.Command, args []string) error {
			return run(args)
		},
	}

	return command
}
