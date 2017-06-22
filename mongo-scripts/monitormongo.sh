#!/bin/bash

NODE1=$1
NODE2=$2
USERNAME=$3
PASSWORD=$4
LOGPATH="/home/ubuntu/mongo/logs"
if [ -d $LOGPATH ];then
  mkdir -p $LOGPATH
fi

adddate() {
    while IFS= read -r line; do
        echo "$(date) $line"
    done
}

ISSEC=`mongo --host $NODE1 -u $USERNAME -p $PASSWORD --authenticationDatabase admin < /home/ubuntu/scripts/checkIfMaster.js | sed -n '3p'`
if [ $ISSEC == "true" ]
then
  MONGO_PRI=$NODE2
  echo "$NODE1 changed to secondary" | adddate >> $LOGPATH/flip.log
else
  MONGO_PRI=$NODE1
  echo "$NODE1 is primary" | adddate >> $LOGPATH/flip.log
fi
echo $ISSEC

## Log Replication lag
mongo --host $MONGO_PRI -u $USERNAME -p $PASSWORD --authenticationDatabase admin < /home/ubuntu/scripts/checklag.js | sed -n '5p' | adddate >> $LOGPATH/replag.log

