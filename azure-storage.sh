#!/bin/bash
# A simple Azure Storage example script

export ApplicationID="Azure application ID"
export TenantID="Azure Tenant ID"
export deploykey="Azure app deploy key"
export AZURE_STORAGE_ACCOUNT="storage_acc_name"
export AZURE_STORAGE_ACCESS_KEY="storage_access_key"

export container_name="samplecontainer"

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

echo "Creating the container..."
az storage container create --name $container_name

export ext="json"
export data_path="/path/datafiles" ##dataFile path
export FILES=`ls $data_path/ | grep -F ".$ext"`
echo "$FILES\n"

if [ ! -z "$FILES" -a "$FILES" != " "  ]; then

        for filename in $FILES; do
                echo "uploading $filename"
                export blob_name="$filename"
                export file_to_upload="$data_path/$filename"
                export destination_file="$data_path/$filename"
                echo "Uploading the file..."
                az storage blob exists --container-name $container_name --name $blob_name | grep -iF '"exists": true'
                SUCCESS=`echo $?`
                if [ "$SUCCESS" == "0" ];then
                        echo "File already exist"
                else
                        echo "Uploading the file..."
                        az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name
                fi
                #echo "Downloading the file..."
                #az storage blob download --container-name $container_name --name $blob_name --file $destination_file --output table
        done
else
        echo "No such files found"
fi

echo "Listing the blobs..."
az storage blob list --container-name $container_name --output table

echo "Done"
