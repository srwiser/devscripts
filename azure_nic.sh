#!/bin/bash

rgs=`az group list -o tsv | awk 'NR>2{print $4}'`

function error_print
{
	error="$0"
	echo "I am printing error"
	echo $error
	continue;
}

for i in $rgs; do

	echo "Processing for resource group $i"
	nic=`az network nic list --resource-group $i -o tsv | awk 'NR>2 {print $8}'`
	for j in $nic; do
		nsg=`az network nic list-effective-nsg --resource-group $i --name $j -o tsv`
		if [ "$?" == "1" ];then
			free_nic=$j
			echo "We can remove $j"
		fi
		echo $nsg
	done
done
