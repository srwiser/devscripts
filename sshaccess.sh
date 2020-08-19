#!/bin/bash

USER=$1
ACCESS=$2
PUBKEYPATH="$HOME/employee_pubkeys"
SLACK_TOKEN="slack_channel_token"
remote_user="linux_sudo_user_on_servers"

if [[ -z "$1" || -z "$2" || -z "$3" ]]; then
    echo ""
    echo "Usage: $0 USER(e.g. merv) ACCESS(grant/revoke) server_identifier"
    echo ""
    echo "Make sure to add Employee's Laptop key to ${PUBKEYPATH}/username_ssh_key"
    echo ""
    exit 1
fi

if [ -e $HOME/scripts/bashrc.sample ]
then
    echo ""
else
    echo ""
    echo "bashrc.sample file not found !!"
    echo ""
    echo "Put bashrc.sample file in $HOME/scripts directory"
    echo ""
    exit 1
fi

SERVERS="
`cat /etc/hosts | grep -i $3 | awk '{print $2}'`"

DATE=`date +%d-%m-%y`

mkdir -p $HOME/logs
mkdir -p $HOME/pubkeys
mkdir -p $HOME/keys

#Check if this user exist in bastion, create if not
/usr/bin/id -u ${USER}
USEREXIST=`echo $?`
if [ "$USEREXIST" == "0" ];then
	echo "${USER} user already exist on bastion"
	sudo cp /home/${USER}/.ssh/id_rsa.pub $HOME/keys/${USER}_pub_rsa
	sudo chmod 0644 $HOME/keys/${USER}_pub_rsa
	echo "Adding ${USER}'s Mac key to ${USER}'s authorized keys on bastion"
        sudo cp ${PUBKEYPATH}/${USER}_ssh_key /home/${USER}/.ssh/authorized_keys
        sudo cp $HOME/scripts/bashrc.sample /home/${USER}/.bashrc
        sudo chown -R ${USER}:${USER} /home/${USER}/.bashrc
	sudo chown -R ${USER}:${USER} /home/${USER}/.ssh/authorized_keys
	sudo chmod 0600 /home/${USER}/.ssh/authorized_keys
	sudo chage ${USER} -M -1
else
	echo "Creating ${USER} on bastion"
	sudo useradd -m ${USER} -s /bin/bash
	echo "Creating ssh key for ${USER} on bastion"
	sudo -u ${USER} ssh-keygen -b 2048 -f /home/${USER}/.ssh/id_rsa -t rsa -N ''
	sudo cp /home/${USER}/.ssh/id_rsa.pub $HOME/keys/${USER}_pub_rsa
        sudo chmod 0644 $HOME/keys/${USER}_pub_rsa
	echo "Adding ${USER}'s Mac key to ${USER}'s authorized keys on bastion"
	sudo cp ${PUBKEYPATH}/${USER}_ssh_key /home/${USER}/.ssh/authorized_keys
        sudo cp $HOME/scripts/bashrc.sample /home/${USER}/.bashrc
        sudo chown -R ${USER}:${USER} /home/${USER}/.bashrc
	sudo chown -R ${USER}:${USER} /home/${USER}/.ssh/authorized_keys
	sudo chmod 0600 /home/${USER}/.ssh/authorized_keys
	sudo chage ${USER} -M -1
fi


if [ "$ACCESS" == "grant" ];then
for server in $SERVERS
do
	#if ssh $server stat ~/.ssh/authorized_keys.before_${USER} \> /dev/null 2\>\&1
        if ssh $server "sudo sh -c '/usr/bin/id -u ${USER}'"
        then
		echo "Adding ${USER} public key to $server authorized keys"
                ssh $server "sudo sh -c 'echo \"`cat ~/keys/${USER}_pub_rsa`\" >> /home/${USER}/.ssh/authorized_keys'"
                ssh $server "sudo chown -R ${USER}:${USER} /home/${USER}/.ssh/"
                ssh $server "sudo chmod 0600 /home/${USER}/.ssh/authorized_keys"
		ssh $server "sudo chage ${USER} -M -1"
                echo "${USER} already authorized on ${server} machine"
                echo "${DATE} ${USER} already authorized on ${server} machine" >> $HOME/logs/sshaccess.log
	else

		ssh $server "sudo useradd -m ${USER} -s /bin/bash"
		ssh $server "sudo mkdir -p /home/${USER}/.ssh"
		echo "Adding ${USER} public key to $server authorized keys"
        	ssh $server "sudo sh -c 'echo \"`cat ~/keys/${USER}_pub_rsa`\" >> /home/${USER}/.ssh/authorized_keys'"
		ssh $server "sudo chown -R ${USER}:${USER} /home/${USER}/.ssh/"
        	ssh $server "sudo chmod 0600 /home/${USER}/.ssh/authorized_keys"
		ssh $server "sudo chage ${USER} -M -1"
        	echo "SSH Access given to ${USER} on $server"
        	echo "${DATE} SSH Access given to ${USER} on $server" >> $HOME/logs/sshaccess.log
	fi

	/usr/bin/curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{"text": " On '$DATE' Access granted to '$USER' on '$server' "}' "https://hooks.slack.com/services/${SLACK_TOKEN}"
done

elif [ "$ACCESS" == "revoke" ];then
for server in $SERVERS
do
	echo "Removing ${USER} public key from $server authorized keys"
        ssh $server "sudo sh -c 'sed -i.bak '/$USER/d' /home/${USER}/.ssh/authorized_keys'"
	echo "SSH Access revoked for ${USER} on $server"
	echo "${DATE} SSH Access revoked for ${USER} on $server" >> $HOME/logs/sshaccess.log

	/usr/bin/curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -d '{"text": " On '$DATE' Access revoked for '$USER' on '$server' "}' "https://hooks.slack.com/services/${SLACK_TOKEN}"
done
else
	echo "only grant/revoke options available!!"
        echo ""
fi
