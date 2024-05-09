package contacts

import (
	"github.com/Kamaalio/kamaalgo/files"
	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go"
)

func InitializeRouter(server *gin.Engine, basePath string, minioClient *minio.Client) {
	group := server.Group(files.AppendFileToPath(basePath, "contacts"))
	group.POST("/", createHandler(minioClient))
}
