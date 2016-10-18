#!/bin/bash
s3fs yairef:/clientscript /root/mounted-s3/clientscript -o uid=48,gid=48,allow_other,default_acl=public_read,use_cache=/tmp/cache/s3-cache,passwd_file=/etc/passwd-s3fs
s3fs yairef:/css /root/mounted-s3/css -o uid=48,gid=48,allow_other,default_acl=public_read,use_cache=/tmp/cache/s3-cache,passwd_file=/etc/passwd-s3fs
s3fs yairef:/images /root/mounted-s3/images -o uid=48,gid=48,allow_other,default_acl=public_read,use_cache=/tmp/cache/s3-cache,passwd_file=/etc/passwd-s3fs
