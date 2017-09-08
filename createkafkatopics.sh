#!/bin/bash
IFS=","
while read f1 f2 f3 f4 
do
        Topic=$f1
        PartitionCount=$f2
        ReplicationFactor=$f3
        RetentionMs=$f4

        /opt/kafka/kafka_2.11-0.11.0.0/bin/kafka-topics.sh --create --zookeeper zookeeper01:2181,zookeeper02:2181 --partitions $PartitionCount --topic $Topic --replication-factor $ReplicationFactor --config retention.ms=$RetentionMs

done < topics.log
