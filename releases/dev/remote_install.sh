#!/bin/bash
echo "Installation remote sdr radio"
echo ""
cd /tmp

function install_dependency {
	echo "--- Installing dependency: $1"
	sudo apt-get -y install $1
}

install_dependency git
install_dependency default-jdk

if [ -d "/home/pi/server" ]; then
	echo "Stop webserver and uninstall remote app"
	echo ""
	sudo /home/pi/server/apache-tomee-webprofile-8.0.10/bin/catalina.sh stop
	sudo rm /home/pi/server/apache-tomee-webprofile-8.0.10/webapps/remote.war
	sudo rm -r /home/pi/server/apache-tomee-webprofile-8.0.10/webapps/remote
fi
if [ ! -d "/home/pi/server" ]; then
	sudo mkdir /home/pi/server
fi


if [ ! -d "/home/pi/server/apache-tomee-webprofile-8.0.10" ]; then
	echo "Webserver not installed; download and install java webserver"
	echo ""
	sudo wget https://dlcdn.apache.org/tomee/tomee-8.0.10/apache-tomee-8.0.10-plus.tar.gz
	sudo tar -xzvf apache-tomee-8.0.10-plus.tar.gz -C /home/pi/server
	sudo chmod +x /home/pi/server/apache-tomee-webprofile-8.0.10/bin/catalina.sh
fi
  
git clone  --depth=1 https://github.com/pa3gsb/Radioberry-2.x-Remote

cd Radioberry-2.x-Remote/releases/dev

sudo cp ./c866b0e691eb97aa8fa46c4f8d281ade.pfx /home/pi/server/apache-tomee-webprofile-8.0.10/conf
sudo cp ./server.xml /home/pi/server/apache-tomee-webprofile-8.0.10/conf

sudo cp ./remote.war /home/pi/server/apache-tomee-webprofile-8.0.10/webapps/remote




