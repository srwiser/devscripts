#!/bin/bash

##Create lvm partition
if [[ -z "$1" || -z "$2" ]]; then
    echo "Usage: $0 /dev/sd* mountpoint(/data or /backup)"
    exit 1
fi

partition=$1
mountpoint=$2
sudo mkdir -p $mountpoint
sudo chmod -R 0755 $mountpoint

randomnumber=`awk -v min=1 -v max=20 'BEGIN{srand(); print int(min+rand()*(max-min+1))}'`
## check if this random number was already used
ls -l /dev/vg$randomnumber
RESULT=`echo $?`
if [ "$RESULT" == "0" ];then
  echo "Generating random number again"
  randomnumber=`awk -v min=1 -v max=20 'BEGIN{srand(); print int(min+rand()*(max-min+1))}'`
else
  echo "Continuing with the generated random number"
fi

sudo apt-get -y install lvm2

sudo pvcreate $partition
sudo vgcreate "vg$randomnumber" $partition
sudo lvcreate -n "disk" -l 100%FREE "vg$randomnumber"
sudo mkfs.ext4 /dev/vg$randomnumber/disk

echo "Append the following line in /etc/fstab file and then run <sudo mount -a>"
echo "/dev/vg$randomnumber/disk $mountpoint ext4 defaults,auto,nodiratime,noexec,relatime 1 1"


