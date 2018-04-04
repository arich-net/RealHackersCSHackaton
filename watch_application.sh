#!/bin/bash
#
RESULT=$(curl -s --header "Content-Type: application/json" --header "Accept: application/json"  \
    -XGET http://localhost:3000/api/Application/app-$1)

echo $RESULT | jq .

 
