#!/bin/sh

#NOTE: this will install the command line tool at /usr/AHFormatter63_64

# unzip the rpm
gzip -N -d bin/AHFormatterV63_64-6.3E-MR3.x86_64.rpm.gz

# install alien
apt-get install alien

# convert rpm to deb and install.
alien -i -d -c bin/AHFormatterV63_64-6.3E-MR3.x86_64.rpm