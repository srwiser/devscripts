#!/bin/bash

## Configure following variables ##
LOCAL_DIR="/backup"  ##/path/to/local
FILE_EXT="tar.gz.enc" ##File extension to upload
BUCKET_NAME="mongo-backup"  ##s3_bucket_name
BUCKET_PATH="daily/"  ##/path/in/bucket
TOTAL_FILES=`ls $LOCAL_DIR | wc -l`

for filename in $LOCAL_DIR/*.$FILE_EXT; do
        cd $LOCAL_DIR
        echo "Uploading $filename ..."
        s3cmd put $filename s3://$BUCKET_NAME/$BUCKET_PATH
done

TOTAL_FILES_S3=`s3cmd ls s3://$BUCKET_NAME/$BUCKET_PATH | wc -l`

if [[ $TOTAL_FILES_S3 > $TOTAL_FILES ]];then
        echo "File upload complete"
else
        echo "Some Files not uploaded"
fi
