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

## Run the Products Microservice

```
cd /home/vagrant/microProducts
export FLASK_APP=run.py
/usr/local/bin/flask run --host=0.0.0.0 --port 5003
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

```
There are 2 machines but in this case we'll use just the "servidor" machine

Before power on the "servidor" machine with vagrant up, we must install and enable the consul service with:

- wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
- echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
- sudo apt update && sudo apt install consul

- consul agent -ui -dev -bind=192.168.50.3 -client=0.0.0.0 -data-dir=.
- npm install consul && npm install express
  
The consul service will running in http://192.168.50.3:8500
Then, open another ssh session of servidor machine and create a dir called flask, install: pip3 install flask-consulate

cd /home/vagrant/flask
sudo vim app.py

```
from flask import Flask
from flask_consulate import Consul

app = Flask(__name__)


@app.route('/healthcheck')
def health_check():
    """
    This function is used to say current status to the Consul.
    Format: https://www.consul.io/docs/agent/checks.html
    :return: Empty response with status 200, 429 or 500
    """
    # TODO: implement any other checking logic.
    return '', 200


# Consul
# This extension should be the first one if enabled:
consul = Consul(app=app)
# Fetch the conviguration:
consul.apply_remote_config(namespace='mynamespace/')

# Register Consul service:
consul.register_service(
    name='MicroWebApp:',
    interval='10s',
    tags=['FRONTEND', 'Web'],
    address='192.168.80.3',
    port=5001,
    httpcheck='http://192.168.80.3:5001/healthcheck'
)


# Registrar BACKEND en Consul (MicroUsers)
consul.register_service(
    name='MicroUsers',
    interval='10s',
    tags=['BACKEND', 'API'],
    address='192.168.80.3',  # IP del backend
    port=5002,
    httpcheck='http://192.168.80.3:5002/healthcheck'
)


# Registrar BACKEND en Consul (MicroProducts)
consul.register_service(
    name='MicroProducts',
    interval='10s',
    tags=['BACKEND_Products', 'API'],
    address='192.168.80.3',  # IP del backend
    port=5003,
    httpcheck='http://192.168.80.3:5003/healthcheck'
)

# Registrar BACKEND en Consul (MicroOrders)
consul.register_service(
    name='MicroOrders',
    interval='10s',
    tags=['BACKEND_2', 'API'],
    address='192.168.80.3',  # IP del backend
    port=5004,
    httpcheck='http://192.168.80.3:5004/healthcheck'
)

app.run(host="0.0.0.0", port=5001, debug=True)
```
To run the app.py: 
python3 app.py

## Run whit Docker Compose

```
locate the docker-compose.yml then

sudo docker compose up -d --build
sudo docker ps to see them running

```


