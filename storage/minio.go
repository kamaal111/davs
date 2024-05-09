package storage

import (
	"errors"
	"fmt"
	"os"

	"github.com/Kamaalio/kamaalgo/strings"
	"github.com/minio/minio-go"
)

func InitializeMinio() (*minio.Client, error) {
	endpoint, err := strings.Unwrap(os.Getenv("MINIO_ENDPOINT"))
	if err != nil {
		return nil, errors.New("MINIO_ENDPOINT not defined in env")
	}

	accessKeyID, err := strings.Unwrap(os.Getenv("MINIO_ACCESS_KEY_ID"))
	if err != nil {
		return nil, errors.New("MINIO_ACCESS_KEY_ID not defined in env")
	}

	secretAccessKey, err := strings.Unwrap(os.Getenv("MINIO_SECRET_ACCESS_KEY"))
	if err != nil {
		return nil, errors.New("MINIO_SECRET_ACCESS_KEY not defined in env")
	}

	useSSL := false
	minioClient, err := minio.New(endpoint, accessKeyID, secretAccessKey, useSSL)
	if err != nil {
		return nil, errors.New("failed to load minio client")
	}

	err = checkBucketsExists(minioClient)
	if err != nil {
		return nil, err
	}

	return minioClient, nil
}

func checkBucketsExists(minioClient *minio.Client) error {
	bucketNames := getBucketNames()
	for _, name := range bucketNames {
		exists, err := minioClient.BucketExists(name)
		if err != nil {
			fmt.Println(err)
			return fmt.Errorf("failed to check if %s bucket exists", name)
		}

		if !exists {
			return fmt.Errorf("%s bucket should exist", name)
		}
	}

	return nil
}

func getBucketNames() []string {
	buckets := []string{
		"contacts",
	}

	return buckets
}
