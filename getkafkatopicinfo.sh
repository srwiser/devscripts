#!/bin/bash
TOPICS="
CLIENT_CONFIG_UPDATED
EXPORT_FILES_TO_SFTP
EXPORT_LEADS_PURGE_SFTP
Emailer"

for topic in $TOPICS
do
        PartitionCount=`/home/ubuntu/kafka/bin/kafka-topics.sh --describe --zookeeper AWS-PROD-C1-ZOOKEEPER-01 --topic $topic | grep -F 'PartitionCount:' | cut -d':' -f3 | tr -dc '0-9'`
        ReplicationFactor=`/home/ubuntu/kafka/bin/kafka-topics.sh --describe --zookeeper AWS-PROD-C1-ZOOKEEPER-01 --topic $topic | grep -F 'ReplicationFactor:' | cut -d':' -f4 | tr -dc '0-9'`
        RetentionMs=`/home/ubuntu/kafka/bin/kafka-topics.sh --describe --zookeeper AWS-PROD-C1-ZOOKEEPER-01 --topic $topic | grep -F 'retention.ms' | cut -d '=' -f2 | tr -dc '0-9'`

        if [ "$RetentionMs" == '' ];then
                RetentionMs=86400000
        fi

        echo "$topic,$PartitionCount,$ReplicationFactor,$RetentionMs" >> ~/topics.log

done
