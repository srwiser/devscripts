#!/bin/bash
echo "Enter elastic node ip and port x.x.x.x:9200"
read elasticurl

INDICES="
index1
index2
index3"

echo "Enter dump path"
read dump_path
mkdir -p $dump_path

echo "Enter elasticdump bin path"
read binpath

for i in $INDICES
do
	curl -XPOST $elasticurl/$i/_open
	sleep 120
	$binpath/elasticdump --input=http://$elasticurl/$i --output=$dump_path/$i.json --type=data
	SUCCESS=`echo $?`
	if [ "$SUCCESS" == "0" ];then
		curl -XPOST $elasticurl/$i/_close
		sleep 20
	else
		echo "Some error in the dump for $i index"
	fi
done
