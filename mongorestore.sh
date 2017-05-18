#!/bin/bash

DBNAME="vymo-lms"
BACKUP_PATH="/home/vagrant/app30832600"
#for indexfile in /home/vagrant/app30832600/*.json; do
#	echo "Restoring indexes from $indexfile"
#	/bin/sed -i 's/, "background" : true//g' $indexfile
#	/usr/bin/mongorestore -d $DBNAME -u vymo-super-user -p AAAAB3NzaC1yc2EAAAADAQABAAACAQCswC6hMNTersMSW4nOdgLh8Gxw9bu0BFvyW3oRgzo1 --authenticationDatabase admin $indexfile
#done
	
for datafile in $BACKUP_PATH/*.bson; do
	echo "Restoring $datafile"
        /usr/bin/mongorestore -d $DBNAME -u vymo-super-user -p AAAAB3NzaC1yc2EAAAADAQABAAACAQCswC6hMNTersMSW4nOdgLh8Gxw9bu0BFvyW3oRgzo1 --authenticationDatabase admin $datafile
done
