#!/bin/bash
echo "Enter Images directory path (like this --> /home/xx/logos )";
read dir
echo "Enter Images S3 path (like this --> https://s3-ap-southeast-1.amazonaws.com/iref-wiki/bank-logos )"
read s3dir

for filename in $dir/*.svg; do
        name=`basename $filename`
	echo $name
	echo "$s3dir/$name" >> $HOME/links.txt;
done
for filename in $dir/*.png; do
        name=`basename $filename`
        echo $name
        echo "$s3dir/$name" >> $HOME/links.txt;
done
for filename in $dir/*.jpg; do
        name=`basename $filename`
        echo $name
        echo "$s3dir/$name" >> $HOME/links.txt;
done

echo "Links have been saved to links.txt file in your $HOME directory"
exit 0
