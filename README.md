# microwebAppBase

Repository where you will find a web application with its respective API, both with frontend and backend to then monitor them in Consul

# To Run application

## Start and SSH into Vagrant VM

```
vagrant up
vagrant ssh servidorWeb
```

## Run the webApp

```
cd /home/vagrant/frontend
export FLASK_APP=run.py
/usr/local/bin/flask run --host=0.0.0.0 --port 5001
```
## Run the Users Microservice

```
cd /home/vagrant/microUsers
export FLASK_APP=run.py
/usr/local/bin/flask run --host=0.0.0.0 --port 5002
```
## Connect consul with microservices

```
We must have another machine called "servidor" which will have as ip 192.168.50.3 which is the one that will host the Consul service, the Vagrantfile will be:

# -- mode: ruby --
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
	
        config.vm.define :servidor do |servidor|
                servidor.vm.box = "bento/ubuntu-20.04"
                servidor.vm.network :private_network, ip: "192.168.50.3"
                servidor.vm.hostname = "servidor"
                servidor.vm.boot_timeout = 1000
        end
        config.vm.define :cliente do |cliente|
                cliente.vm.box = "bento/ubuntu-20.04"
                cliente.vm.network :private_network, ip: "192.168.50.2"
                cliente.vm.hostname = "cliente"
                cliente.vm.boot_timeout = 1000
        end
end

There are 2 machines but in this case we'll use just the "servidor" machine


Before power on the "servidor" machine with vagrant up, we must enable the consul service with:
```
consul agent -ui -dev -bind=192.168.50.3 -client=0.0.0.0 -data-dir=.

```
The consul service will running in http://192.168.50.3:8500

```
