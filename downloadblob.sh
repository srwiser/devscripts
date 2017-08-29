#!/bin/bash

export ApplicationID="Azure application ID"
export TenantID="Azure Tenant ID"
export deploykey="Azure app deploy key"
export AZURE_STORAGE_ACCOUNT="storage_acc_name"
export AZURE_STORAGE_ACCESS_KEY="storage_acc_key"

export container_name="sample_container"
export blob_name="sample_file"
export destination_file="$HOME/$blob_name"

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

az storage blob download --container-name $container_name --name $blob_name --file $destination_file --output table
