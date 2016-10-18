#!/bin/bash
CNT=`/usr/bin/mysql -uroot -ppassword -e "SHOW SLAVE STATUS\G" | grep 'Slave_SQL_Running: ' | awk '{ if ($2 == "Yes") print 1; else print 2 }'`
echo $CNT
exit $CNT
