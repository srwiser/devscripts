#!/bin/bash
# A simple Azure Storage example script

export AZURE_STORAGE_ACCOUNT="Acc_name"
export AZURE_STORAGE_ACCESS_KEY="Acc_key"

export container_name="Con_name"
echo "Creating the container..."

az storage container create --name $container_name

FILES="List_of_files"  ## you can read this from a directory
echo "$FILES\n"
if [ ! -z "$FILES" -a "$FILES" != " "  ]; then

        for filename in $FILES; do
                echo "uploading $filename"
                export blob_name="$filename"
                export file_to_upload="/data/path/$filename"
                echo "Uploading the file..."
                az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name
        done
else
        echo "No such files found"
fi

export destination_file=

echo "Listing the blobs..."
az storage blob list --container-name $container_name --output table

echo "Downloading the file..."
az storage blob download --container-name $container_name --name $blob_name --file $destination_file --output table

echo "Done"
