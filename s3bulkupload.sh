#!/bin/bash

## Configure following variables ##
LOCAL_DIR="/backup"  ##/path/to/local
FILE_EXT="tar.gz.enc" ##File extension to upload
BUCKET_NAME="mongo-backup"  ##s3_bucket_name
BUCKET_PATH="daily/"  ##/path/in/bucket
TOTAL_FILES=`ls $LOCAL_DIR | wc -l`

for filename in $LOCAL_DIR/*.$FILE_EXT; do
        cd $LOCAL_DIR
	s3cmd ls s3://$BUCKET_NAME/$BUCKET_PATH | grep -i "$filename"
        SUCCESS=`echo $?`
        if [ "$SUCCESS" == "0" ];then
           echo "File already exist"
        else
           echo "Uploading $filename ..."
           s3cmd put $filename s3://$BUCKET_NAME/$BUCKET_PATH
        fi
done

TOTAL_FILES_S3=`s3cmd ls s3://$BUCKET_NAME/$BUCKET_PATH | wc -l`

if [[ $TOTAL_FILES_S3 > $TOTAL_FILES ]];then
        echo "File upload complete"
else
        echo "Some Files not uploaded"
fi
