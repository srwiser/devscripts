#!/bin/bash

# How to install PHP memcached on CentOS 6.5+

# Install dependencies
yum install cyrus-sasl-devel zlib-devel gcc-c++

# Get the latest libmemcached
wget https://launchpad.net/libmemcached/1.0/1.0.18/+download/libmemcached-1.0.18.tar.gz
tar -xvf libmemcached-1.0.18.tar.gz
cd libmemcached-1.0.18

# Compile and install liblmemcached with sasl disabled
./configure --disable-memcached-sasl
make
make install

# After memcached's dependencies has been satisfied, install it with pecl
pecl install memcached

# Enable it for PHP
echo "extension=memcached.so" > /etc/php.d/memcached.ini

# Restart any PHP related daemons
service httpd restart
