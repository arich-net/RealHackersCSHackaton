#!/bin/bash
#
TOKEN="EXSvdxD4Aodea014gatyHOXace3J6VGAstxfJ52AgL9RMHWidfCG6TVCsV1mdCif"
RESULT=$(curl -s -k --header "Content-Type: application/json" \
    --header "X-Access-Token: $TOKEN" \
    --header "Accept: application/json"  \
    -XGET https://blockchain.arich-net.com/api/Application/app-$1)

echo $RESULT | jq .

 
