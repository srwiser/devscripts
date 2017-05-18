#!/bin/bash

## Configure following variables ##
FILE_EXT="json" ##File extension to upload
BUCKET_NAME="vymo-mongo-backup"  ##s3_bucket_name
BUCKET_PATH="daily/"  ##/path/in/bucket

LIST=`s3cmd ls s3://$BUCKET_NAME/$BUCKET_PATH | grep $FILE_EXT | awk '{print $4}'`
echo "$LIST\n"
if [ ! -z "$LIST" -a "$LIST" != " "  ]; then

	for filename in $LIST; do
		echo "Deleting $filename ..."
		s3cmd del $filename
	done
else
	echo "No such files found"
fi
