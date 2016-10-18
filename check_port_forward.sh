#!/bin/sh
local_port=3306
ext_port=3306
host=54.255.190.143
user=root

do_start(){
CNT=`lsof -i:$local_port | grep 'ssh' | awk '{ if ($2 > 0) print 1; else print 2}' | tail -n 1`
if [[ $CNT -ne 1 ]]; then
	ssh -i ~/key-pairs/IREF_new.pem -f -N -L $local_port:127.0.0.1:$ext_port $user@$host
else
	echo "All fine" >> /dev/null
fi
}

do_stop(){
PID=`lsof -i:$local_port | grep 'ssh' | awk '{ print $2 }' | tail -n 1`
kill -9 $PID
}

case "$1" in

	start) do_start
	       ;;
	stop) do_stop
	      ;;

	*)    echo "Usage: ./check_port_forward.sh {start|stop}" >&2
	      exit 3
	      ;;
esac
