#!/bin/bash
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'
ACC_KEY=$AWS_ACCESS_KEY
SEC_KEY=$AWS_SECRET_KEY

command -v aws >/dev/null 2>&1 || { printf >&2 "${RED}Required aws cli, but it's not installed.${NC}\n Refer this ${BLUE} https://docs.aws.amazon.com/cli/latest/userguide/install-macos.html#awscli-install-osx-path ${NC}\n"; exit 1; }
ip=`curl http://icanhazip.com`
echo "Security group id: "
read group
echo "Port to allow: "
read port

echo "You want your public ip for this rule ?"
select yn in "yes" "no"; do
    case $yn in
        yes ) echo $ip;aws ec2 authorize-security-group-ingress --group-id $group --protocol tcp --port $port --cidr $ip/32;break;;
        no ) echo "Enter the IP you want to allow: "; read ipnet; echo $ipnet;aws ec2 authorize-security-group-ingress --group-id $group --protocol tcp --port $port --cidr $ipnet/32; break;;
	* ) echo "Please answer 1 or 2";;
    esac
done

