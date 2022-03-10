#!/bin/bash
echo "Start remote sdr radio"
echo ""
echo "Command window; switch to 'su' user and than execute this shell script."
echo ""

export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-armhf
export LD_LIBRARY_PATH=/home/pi/server/apache-tomee-webprofile-8.0.10/webapps/remote/WEB-INF/classes/linux:$LD_LIBRARY_PATH

/home/pi/server/apache-tomee-webprofile-8.0.10/bin/catalina.sh start