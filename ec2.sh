#!/bin/bash
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'
ACC_KEY=$AWS_ACCESS_KEY
SEC_KEY=$AWS_SECRET_KEY

command -v ec2-authorize -O $ACC_KEY -W $SEC_KEY >/dev/null 2>&1 || { printf >&2 "${RED}Required ec2-authorize but it's not installed.${NC}\n Refer this ${BLUE} http://docs.aws.amazon.com/AWSEC2/latest/CommandLineReference/set-up-ec2-cli-linux.html#setting_up_ec2_command_linux ${NC}\n"; exit 1; }
ip=`curl http://icanhazip.com`
echo "Security group id: "
read group
echo "Port to allow: "
read port

echo "You want your public ip for this rule ?"
select yn in "yes" "no"; do
    case $yn in
        yes ) echo $ip;ec2-authorize -O $ACC_KEY -W $SEC_KEY $group --region ap-southeast-1 -P tcp -p $port -s $ip/32;break;;
        no ) echo "Enter the IP you want to allow: "; read ipnet; echo $ipnet;ec2-authorize -O $ACC_KEY -W $SEC_KEY $group --region ap-southeast-1 -P tcp -p $port -s $ipnet/32; break;;
	* ) echo "Please answer 1 or 2";;
    esac
done

