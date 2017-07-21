#!/bin/bash

if [[ -z "$1" || -z "$2" || -z "$3" ]]; then
    echo "Usage: $0 backup_dir days_to_rotate file_ext delete/list"
    exit 1
fi

## Delete backup files on local which are older than x days
BACKUP_DIR=$1
DAYS=$2
EXT=$3
ACTION=$4


function list_files {
        find $1 -mtime +$2 -exec ls {} \;|grep -F ".$EXT"
}

function delete_files {
        sudo rm $1
}

if [ $ACTION == "list" ];
then
        echo "Listing files older than $DAYS days in $BACKUP_DIR"
        list_files $BACKUP_DIR $DAYS
elif [ $ACTION == "delete" ];
then
        echo "Deleting files older than $DAYS days in $BACKUP_DIR"
        listed_files=`list_files $BACKUP_DIR $DAYS`
        for filename in $listed_files;
        do
                echo "deleting $filename ..."
                delete_files $filename
        done
else
        echo "Unknown option"
fi
