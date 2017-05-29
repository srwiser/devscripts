#!/bin/bash

# for use with cron, eg:
# 0 3 * * * /bin/bash /home/ubuntu/scripts/prune_backup.sh daily/weekly/monthly backups_to_keep

if [[ -z "$1" || -z "$2" ]]; then
    echo "Usage: $0 <daily/weekly/monthly> <backups_to_keep>"
    echo "Default values for Daily=7, Weekly=5 & Monthly=12"
    exit 1
fi

DIR="/backup"; shift
NUM_OF_DAYS="$2"; shift

## Default values
KEEP_DAILY=7
KEEP_WEEKLY=5
KEEP_MONTHLY=12

function abort {
    echo "aborting..."
    exit 1
}

mkdir -p $DIR/$HOSTNAME/daily || abort
mkdir -p $DIR/$HOSTNAME/weekly || abort
mkdir -p $DIR/$HOSTNAME/monthly || abort
mkdir -p $DIR/$HOSTNAME/yearly || abort

function prune {  
    dir=$DIR/$HOSTNAME/$1
    keep=$2
    ls $dir | sort -rn | awk " NR > $keep" | while read f; do rm $dir/$f; done
}

prune daily $KEEP_DAILY
prune weekly $KEEP_WEEKLY
prune monthly $KEEP_MONTHLY
