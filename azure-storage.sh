#!/bin/bash
# A simple Azure Storage example script

export AZURE_STORAGE_ACCOUNT="storage_acc_name"
export AZURE_STORAGE_ACCESS_KEY="storage_acc_key"

export container_name="blob_container_name"
echo "Creating the container..."
az storage container create --name $container_name

ext="csv"
data_path="/data/dump/csv/$container_name"
FILES=`ls $data_path/ | grep -F ".$ext"`
echo "$FILES\n"

if [ ! -z "$FILES" -a "$FILES" != " "  ]; then

        for filename in $FILES; do
                echo "uploading $filename"
                export blob_name="$filename"
                export file_to_upload="$data_path/$filename"
                export destination_file="$data_path/$filename"
                echo "Uploading the file..."
                az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name
                echo "Downloading the file..."
                #az storage blob download --container-name $container_name --name $blob_name --file $destination_file --output table
        done
else
        echo "No such files found"
fi

echo "Listing the blobs..."
az storage blob list --container-name $container_name --output table

echo "Done"