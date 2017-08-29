#!/bin/bash

export ApplicationID="Azure application ID"
export TenantID="Azure Tenant ID"
export deploykey="Azure app deploy key"

## Check az command working or not
az
COMMAND_STATUS=`echo $?`
if [ "$COMMAND_STATUS" == "0" ];then
        echo "az cli is installed"
else
        echo "Please refer to this url https://docs.microsoft.com/en-us/cli/azure/install-azure-cli  to install azure cli"
        exit 1
fi

## Create service principal
az account show
LOGIN_STATUS=`echo $?`
if [ "$LOGIN_STATUS" == "0" ];then
        echo "Already logged in to azure"
else
        az login -u $ApplicationID --service-principal --tenant $TenantID -p $deploykey
fi

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
