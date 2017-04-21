#!/bin/sh

# Updates etc at: https://github.com/woxxy/MySQL-backup-to-Amazon-S3
# Under a MIT license

# change these variables to what you need
S3BUCKET=iref-backup
FILENAME=attachment
# the following line prefixes the backups with the defined directory. it must be blank or end with a /
S3PATH=attachments/
TMP_PATH=/tmp/
MOUNT_PATH=/mnt/nfs/home
DATESTAMP=$(date +".%m.%d.%Y")
DAY=$(date +"%d")
DAYOFWEEK=$(date +"%A")

echo "Starting compression..."
cd ${TMP_PATH}
tar czf ${FILENAME}${DATESTAMP}.tar.gz ${MOUNT_PATH}

echo "Done compressing the backup file."

echo "Uploading the new backup..."
s3cmd put -f ${FILENAME}${DATESTAMP}.tar.gz s3://${S3BUCKET}/${S3PATH}
echo "New backup uploaded."

echo "Removing the cache files..."
rm -rf ${TMP_PATH}${FILENAME}${DATESTAMP}.tar.gz
echo "Files removed."
echo "All done."
