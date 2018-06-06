#!/bin/bash
#
JSON_DATA="
{
  "index": {
    "fields":[
      {
        "data.applicationStatus": "asc"
      }
    ]
  },
  "type": "json"
}
"

echo $JSON_DATA

curl -v -XPOST \
     -H 'Content-Type: application/json' \
     -H 'Accept: application/json' \
     -d '
{
  "index": {
    "fields":[
      {
        "data.applicationStatus": "asc"
      }
    ]
  },
  "type": "json"
}
' \
     http://localhost:5984/composerchannel/_index

