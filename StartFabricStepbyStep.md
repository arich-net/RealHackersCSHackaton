INSTALL FABRIC FROM ZERO
========================
* Cleanup everything
```
$ ./stopFabric.sh
$ ./teardownFabric.sh
$ ./teardownAllDocker.sh
$ for card in `composer card list | egrep real-hackers | awk '($1 !~ /Connection/) {print $2}'`; do composer card delete -c $card; done
$ rm -rf ~/.composer
$ docker rmi $(docker images -q)
```
* Uninstall all composer environment
```
npm uninstall -g composer-cli composer-rest-server generator-hyperledger-composer
npm uninstall -g composer-playground
```
* Install composer environment
```
npm install -g composer-cli@0.19.5 composer-rest-server@0.19.5 generator-hyperledger-composer@0.19.5
npm install -g composer-playground
```
* Start Up2Dated Infrastructure
```
$ ./downloadFabric.sh
$ ./startFabric.sh
```
>NOTE 1: 
>* Verify docker containers
>```
>$ docker ps
>```
>* Get logs from docker containers
>```
>$ docker logs -f $CONTAINER_NAME
>```

* Create connection.json
```json
{
    "name": "real-hackers-network",
    "x-type": "hlfv1",
    "version": "1.0.0",
    "peers": {
        "peer0.org1.example.com": {
            "url": "grpc://192.168.130.14:7051",
            "eventUrl": "grpc://192.168.130.14:7053"
        }
    },
    "certificateAuthorities": {
        "ca.org1.example.com": {
            "url": "http://192.168.130.14:7054",
            "caName": "ca.org1.example.com"
        }
    },
    "orderers": {
        "orderer.example.com": {
            "url": "grpc://192.168.130.14:7050"
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        }
    },
    "channels": {
        "composerchannel": {
            "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                }
            }
        }
    },
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    }
}
```
* Create PeerAdmin card 
```
$ composer card create -p connection.json \
    -u PeerAdmin -c ~/fabric-networks/Admin@org1.example.com-cert.pem \
    -k ~/fabric-networks/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk \
    -r PeerAdmin -r ChannelAdmin
```
* Import Business Netowrk Admin Card into composer cards
```
$ composer card import -f PeerAdmin@real-hackers-network.card
```
>NOTE 2:
>* To check imported cards
>```
>$ composer card list 
>```
* Configure NPM on container peer0.org1.example.com to not verify SSL connections due we go through a Proxy. We crate the following nmprc file
```
$ cat /opt/hyperledger/git/RealHackersCSHackaton/npmrc.docker 
; userconfig /opt/hyperledger/.npmrc
strict-ssl = false
```
* Create business network definition BNA
```
$ composer archive create --sourceType dir --sourceName .
```
* Install Composer Business Network with PeerAdmin card
```
$ composer network install -c PeerAdmin@real-hackers-network \
    -a real-hackers-flow@`jq .version < package.json | sed -e s/\"//g`.bna \
    -o npmrcFile=/opt/hyperledger/git/RealHackersCSHackaton/npmrc.docker
```
* Start Composer Business Network and create Admin Card
```
$ composer network start --networkName real-hackers-flow \
    --networkVersion `jq .version < package.json | sed -e s/\"//g` \
    -A admin -S adminpw -c PeerAdmin@real-hackers-network
```
* Import admin of network business card
```
$ composer card import -f admin@real-hackers-flow.card 
```
* Verify business network is correctly installed
```
$ composer network ping -c admin@real-hackers-flow
```
Configure composer-rest on docker with GitHub OAuth
===================================================
* Create card for REST admin account
```
$ composer participant add -c admin@real-hackers-flow \
   -d '{
      "$class":"org.hyperledger.composer.system.NetworkAdmin", 
      "participantId":"restadmin"
   }'
$ composer identity issue -c admin@real-hackers-flow -f restadmin.card \
   -u restadmin -a "resource:org.hyperledger.composer.system.NetworkAdmin#restadmin"
$ composer card import -f restadmin.card
```
* Start mongo docker interface to store states using loopback-connector
```
$ docker run -d --name mongo --network composer_default -p 27017:27017 mongo
```
* Check the following DockerFile
```
$ cat Dockerfile 
FROM hyperledger/composer-rest-server
RUN npm install --production loopback-connector-mongodb passport-github && \
    npm install base64-js ieee754 && \
    npm cache clean --force && \
    ln -s node_modules .node_modules
```
* Build docker image for composer-rest
```
$ docker build -t myorg/my-composer-rest-server .
```
* Check the corresponding environment variables 
```
$ cat envvars.txt
COMPOSER_CARD=restadmin@real-hackers-flow
COMPOSER_NAMESPACES=never
COMPOSER_AUTHENTICATION=true
COMPOSER_MULTIUSER=true
COMPOSER_PROVIDERS='{
    "github": {
        "provider": "github",
        "module": "passport-github",
        "clientID": "******************",
        "clientSecret": "********************************",
        "authPath": "/auth/github",
        "callbackURL": "https://blockchain.arich-net.com/auth/github/callback",
        "successRedirect": "http://blockchain.arich-net.com/Success.htm",
        "failureRedirect": "http://blockchain.arich-net.com/Fail.htm"
    }
}'
COMPOSER_DATASOURCES='{
    "db": {
        "name": "db",
        "connector": "mongodb",
        "host": "mongo"
    }
}'
```
* Set environment variables and test is working
```
$ source envvars.txt
$ echo $COMPOSER_CARD
restadmin@real-hackers-flow
```
* Make ~/.composer read/write for ALL
```
$ chmod -R 777 ~/.composer
```
* Run docker image my-composer-rest-server
```
$ docker run \
     -d \
     -e COMPOSER_CARD=${COMPOSER_CARD} \
     -e COMPOSER_NAMESPACES=${COMPOSER_NAMESPACES} \
     -e COMPOSER_AUTHENTICATION=${COMPOSER_AUTHENTICATION} \
     -e COMPOSER_MULTIUSER=${COMPOSER_MULTIUSER} \
     -e COMPOSER_PROVIDERS="${COMPOSER_PROVIDERS}" \
     -e COMPOSER_DATASOURCES="${COMPOSER_DATASOURCES}" \
     -e NODE_TLS_REJECT_UNAUTHORIZED="0" \
     -v ~/.composer:/home/composer/.composer \
     --name rest \
     --network composer_default \
     -p 3000:3000 \
     myorg/my-composer-rest-server
```
* Verify docker rest logs
```
$ docker logs -f rest
```
* Add Bank participants
```
$ composer participant add -c admin@real-hackers-flow \
   -d '{
      "$class": "org.real.hackers.Bank",
      "bankId": "bankid0001",
      "name": "Credit Suisse"
   }'
$ composer participant add -c admin@real-hackers-flow \
   -d '{
      "$class": "org.real.hackers.Bank",
      "bankId": "bankid0002",
      "name": "UBS"
   }'
```
* Add User participants
```
$ composer participant add -c admin@real-hackers-flow \
   -d '{
      "$class": "org.real.hackers.User",
      "userId": "arich-net",
      "email": "arich.net@gmail.com",
      "firstName": "Ariel",
      "lastName": "Vasquez",
      "userGroup": "peerAdmin"
   }'
$ composer identity issue -u arich-net -a org.real.hackers.User#arich-net -c admin@real-hackers-flow 
$ composer card import -f arich-net@real-hackers-flow.card

$ composer participant add -c admin@real-hackers-flow \
   -d '{
      "$class": "org.real.hackers.User",
      "userId": "FabianDi",
      "email": "fdiergardt@gmx.de",
      "firstName": "Fabian",
      "lastName": "Diergart",
      "userGroup": "peerAdmin"
   }'
$ composer identity issue -u FabianDi -a org.real.hackers.User#FabianDi -c admin@real-hackers-flow 
$ composer card import -f FabianDi@real-hackers-flow.card
```
* Test one of the participants
```
$ composer network ping -c arich-net@real-hackers-flow
The connection to the network was successfully tested: real-hackers-flow
        Business network version: 0.0.1
        Composer runtime version: 0.19.1
        participant: org.real.hackers.User#arich-net
        identity: org.hyperledger.composer.system.Identity#4e7dec33a837511146c58631fd07e0becf909f19e599d6bfb2fcaa416e09a3cc
```
>NOTE 3: Sometimes there are updates that may affect your business network. Please try to refresh any docker image on your side
>* List docker images
>```
>$ docker images
>```
>* Remove image
>```
>$ docker rmi $IMAGE_ID
>```
>* Remove container (Useful when image contains childs)
>```
>$ docker rm $CONTAINER_NAME
>```
* Export the cards before importing them into the wallets
```
$ composer card export -c arich-net@real-hackers-flow -f arich-net@real-hackers-flow.card
$ composer card export -c FabianDi@real-hackers-flow -f FabianDi@real-hackers-flow.card
```
* Import credential files into wallets using explorer (api/wallet/import)

