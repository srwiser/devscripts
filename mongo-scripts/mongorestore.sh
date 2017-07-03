#!/bin/bash

PRIM_HOST=$1
DBNAME=$2
DB_SUPER_USER=$3
DB_SUPER_PASSWORD=$4
BACKUP_PATH=$5

if [[ -z $1 || -z $2 || -z $3 || -z $4 || -z $5 ]];then
        echo "Usage: $0 prim_ip database_name super_user_name super_user_password bson_files_path"
        exit 1;
fi
	
for datafile in $BACKUP_PATH/*.bson; do
	echo "Restoring $datafile"
        /usr/bin/mongorestore -h $PRIM_HOST --drop -d $DBNAME -u $DB_SUPER_USER -p $DB_SUPER_PASSWORD --authenticationDatabase admin $datafile
done
