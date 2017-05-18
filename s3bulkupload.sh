#!/bin/bash

## Configure following variables ##
LOCAL_DIR="/home/vagrant/app30832600"  ##/path/to/local
FILE_EXT="json" ##File extension to upload
BUCKET_NAME="vymo-mongo-backup"  ##s3_bucket_name
BUCKET_PATH="daily/"  ##/path/in/bucket


for filename in $LOCAL_DIR/*.$FILE_EXT; do
	cd $LOCAL_DIR
	s3cmd put $filename s3://$BUCKET_NAME/$BUCKET_PATH
done
