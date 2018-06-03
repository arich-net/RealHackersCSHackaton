# Test Dev Locally

## Requirements

* Python 2.X
* Update hosts as follows
  * Linux (/etc/hosts)
  ```
  127.0.0.1	testblockchain.arich-net.com	testblockchain
  ```
  * Windows (C:\Windows\System32\drivers\etc\hosts)
  ```
  127.0.0.1	testblockchain.arich-net.com	testblockchain
  ```
* Firefox Cookie Manager plugin [link](https://addons.mozilla.org/en-US/firefox/addon/a-cookie-manager/)

## Step by Step

* Create a cookie using the following information
  * URL: http://testblockchain.arich-net.com/
  * Name: access_token
  * Value: test%3Alocal.cookie
  * Domain: Host-only cookie for given URL
  * Path: /(default)
  * Expiration: (some day in the future)
  [Create cookie 1][cookie1]
  [Create cookie 1][cookie1]

* Start with python the script _webserver.py_
```
$ python webserver.py 8000
Starting httpd...
127.0.0.1 - - [03/Jun/2018 21:42:43] "GET /json/pingapi.json HTTP/1.1" 200 -
127.0.0.1 - - [03/Jun/2018 22:10:42] "GET /Bank.htm HTTP/1.1" 200 -
127.0.0.1 - - [03/Jun/2018 22:10:42] "GET /scripts/login.js HTTP/1.1" 200 -
127.0.0.1 - - [03/Jun/2018 22:10:42] "GET /json/selectBankStatusAll.json HTTP/1.1" 200 -
```

* Start Firefox and go to the site http://testblockchain.arich-net.com:8000/Index.htm
[firefox][firefox]

[cookie1]: https://raw.githubusercontent.com/arich-net/RealHackersCSHackaton/master/images/local_cookie.png
[cookie2]: https://raw.githubusercontent.com/arich-net/RealHackersCSHackaton/master/images/local_cookie_2.png
[firefox]: https://raw.githubusercontent.com/arich-net/RealHackersCSHackaton/master/images/firefox_browser.png