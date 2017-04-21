#!/bin/sh

# Updates etc at: https://github.com/woxxy/MySQL-backup-to-Amazon-S3
# Under a MIT license

# change these variables to what you need
MYSQLROOT=root
MYSQLPASS=""
S3BUCKET=iref-backup
FILENAME=popertyforum
DATABASE='popertyforum'
# the following line prefixes the backups with the defined directory. it must be blank or end with a /
S3PATH=database/
# when running via cron, the PATHs MIGHT be different. If you have a custom/manual MYSQL install, you should set this manually like MYSQLDUMPPATH=/usr/local/mysql/bin/
MYSQLPATH=/usr/bin/
#tmp path.
TMP_PATH=/tmp/

DATESTAMP=$(date +".%m.%d.%Y")
DAY=$(date +"%d")
DAYOFWEEK=$(date +"%A")

#PERIOD=${1-day}
#if [ ${PERIOD} = "auto" ]; then
#	if [ ${DAY} = "01" ]; then
#        	PERIOD=month
#	elif [ ${DAYOFWEEK} = "Sunday" ]; then
#        	PERIOD=week
#	else
#       	PERIOD=day
#	fi	
#fi

#echo "Selected period: $PERIOD."

# Stop Slave SQL Thread
${MYSQLPATH}mysql -e 'STOP SLAVE SQL_THREAD;'
echo "Stopped slave"

echo "Starting backing up the database to a file..."

${MYSQLPATH}mysqldump --user=${MYSQLROOT} --password=${MYSQLPASS} ${DATABASE} > ${TMP_PATH}${FILENAME}.sql

echo "Done backing up the database to a file."

# Start Slave SQL Thread
${MYSQLPATH}mysql -e 'START SLAVE SQL_THREAD;'
echo "Started slave"

echo "Starting compression of backup file..."

tar czf ${TMP_PATH}${FILENAME}${DATESTAMP}.tar.gz ${TMP_PATH}${FILENAME}.sql

echo "Done compressing the backup file."

# we want at least two backups, two months, two weeks, and two days
#echo "Removing old backup (2 ${PERIOD}s ago)..."
#s3cmd del --recursive s3://${S3BUCKET}/${S3PATH}previous_${PERIOD}/
#echo "Old backup removed."

#echo "Moving the backup from past $PERIOD to another folder..."
#s3cmd mv --recursive s3://${S3BUCKET}/${S3PATH}${PERIOD}/ s3://${S3BUCKET}/${S3PATH}previous_${PERIOD}/
#echo "Past backup moved."

# upload all databases
echo "Uploading the new backup..."
s3cmd put -f ${TMP_PATH}${FILENAME}${DATESTAMP}.tar.gz s3://${S3BUCKET}/${S3PATH}
echo "New backup uploaded."

echo "Removing the cache files..."
# remove databases dump
rm ${TMP_PATH}${FILENAME}.sql
rm ${TMP_PATH}${FILENAME}${DATESTAMP}.tar.gz
echo "Files removed."
echo "All done."
