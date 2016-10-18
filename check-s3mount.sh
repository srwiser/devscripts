#!/bin/bash
ps -ef | grep [s3]fs | awk '{print $2}'
