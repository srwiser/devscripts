#!/bin/bash

NODE1=$1
NODE2=$2
USERNAME=$3
PASSWORD=$4
LOGPATH="$PWD/logs"
mkdir -p $LOGPATH

if [[ -z $1 || -z $2 || -z $3 || -z $4 ]];then
        echo "Usage: $0 prim_ip sec_ip super_user_name super_user_password"
        exit 1;
fi

adddate() {
    while IFS= read -r line; do
        echo "$(date) $line"
    done
}
ISSEC=`mongo --host $NODE1 -u $USERNAME -p $PASSWORD --authenticationDatabase admin < $PWD/checkIfMaster.js | sed -n '3p'`
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
mongo --host $MONGO_PRI -u $USERNAME -p $PASSWORD --authenticationDatabase admin < $PWD/checkreplicationlag.js | awk 'NR==3 {print $2}'+'NR==5 {print $1" "$2}'+'NR==6 {print $2}'+'NR==8 {print $1" "$2}' | adddate >> $LOGPATH/replag.log
printf "\n" >> $LOGPATH/replag.log
