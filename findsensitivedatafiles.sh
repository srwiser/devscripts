#!/bin/bash
CLIENTS="
abc
bcds
xxyy"

DIRS="
/home/$USER
/data
/tmp"

EXT="
csv
json
bson
tar.gz"
##Lets run a check for all the above
rm -rf /tmp/filelogs ##clean directory first
mkdir -p /tmp/filelogs

for cl in $CLIENTS
do
	for di in $DIRS
	do
		if [ -d "$di" ];then
			echo "Checking for sensitive files on $HOSTNAME in $di"
			for extension in $EXT
			do
				S_FILES=`find $di/ -name "$cl*.$extension" -type f`
				if [ ! -z "$S_FILES" -a "$S_FILES" != " " ];then
					echo "Found sensitive data files for $cl"
					echo "$S_FILES" >> "/tmp/filelogs/$cl-$HOSTNAME.log"
				fi
			done
		fi
	done
done

			


