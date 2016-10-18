#!/bin/bash

max=0
echo "How many rows in a pyramid ?"
read max
reset
for (( i=1; i<=$max; i++ ))
do
	for (( j=1; j<=i; j++ ))
	do	
		echo -n "$j"
	done
	echo  " "
done
