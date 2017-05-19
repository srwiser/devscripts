#!/bin/bash

DBNAME="database name"
BACKUP_PATH="/backup"
DB_ADMIN_USER="database admin"
DB_ADMIN_PASSWORD="admin password"
	
for datafile in $BACKUP_PATH/*.bson; do
	echo "Restoring $datafile"
        /usr/bin/mongorestore -d $DBNAME -u $DB_ADMIN_USER -p $DB_ADMIN_PASSWORD --authenticationDatabase admin $datafile
done
