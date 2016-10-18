#!/bin/bash
rsync -av --update /var/www/html/iref_vbulletin/public_html/images/ /root/mounted-s3/images/
rsync -av --update /var/www/html/iref_vbulletin/public_html/css/ /root/mounted-s3/css/
rsync -av --update /var/www/html/iref_vbulletin/public_html/clientscript/ /root/mounted-s3/clientscript/
