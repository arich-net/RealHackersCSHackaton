function isEmpty(str) {
    return (!str|| 0 === str.length);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function verifySessionToken() {
    var myCookie = getCookie("access_token");

    if (isEmpty(myCookie)) {
        // do cookie doesn't exist stuff;
        console.log("Oops No access token found");
        return false
    }
    else {
        var pivot = myCookie.match(/.*:([^\.]*).*/);
        var access_token = pivot[1];
        console.log("Access_Token: " + access_token);
        return access_token;
    }
}

function getParticipantID() {
    var processed = false;
    var xhr = new XMLHttpRequest();
    var pingapi = "https://blockchain.arich-net.com/api/system/ping";
    var pingloc = "json/pingapi.json";

    if (accessToken != "local") {
        xhr.open("GET", pingapi, true);
    } else {
        console.log("Running in simulation mode - getParticipantID");
        xhr.open("GET", pingloc, true);
    }
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-Access-Token', accessToken);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var userdata = JSON.parse(this.responseText);
            // Get User Data to store it on a cookie
            var pivot = userdata.participant.match(/.*#(.*)/);
            var participantid = pivot[1];
            getParticipantData(participantid, function(){
                console.log("User Data ready");
                var decoded_userdata = getCookie("rh_userdata");
                var c_userdata = JSON.parse(decoded_userdata);
                document.getElementById("Participant").innerHTML = c_userdata.firstName +  " " + c_userdata.lastName;
                //document.getElementById("Participant").innerHTML = userdata.participant;
                document.getElementById("uploadcard").disabled = true;  
            });
        } else if (this.readyState == 4 && this.status == 500) {
            document.getElementById("Participant").innerHTML = "<font color='red'>Please upload your card to your identity</font>";
            document.getElementById("uploadcard").disabled = false;
        }
    };
    xhr.send();

}

function getParticipantData(participantid, callback) {
    if (participantid != undefined) {
        var userapi = "https://blockchain.arich-net.com/api/User/" + participantid;
        var userloc = "json/User_" + participantid + ".json";
        var xhr = new XMLHttpRequest();

        if (accessToken != "local") {
            xhr.open("GET", userapi, true);
        } else {
            console.log("Running in simulation mode - getParticipantData");
            xhr.open("GET", userloc, true);
        }

        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-Access-Token', accessToken);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Save User Data on a Cookie
                var d = new Date();
                d.setTime(d.getTime() + (14 * 24 * 60 * 60 * 1000));
                var expires = "expires="+d.toUTCString();
                var userapidata = JSON.parse(this.responseText);
                var jsonuserdata = JSON.stringify({userId: userapidata.userId, 
                                                   firstName: userapidata.firstName,
                                                   lastName: userapidata.lastName,
                                                   bank: userapidata.bank});
                document.cookie = "rh_userdata=" + jsonuserdata + ";" + expires + ";path=/";
                callback();
            }
        };
        xhr.send();
    }
}

function uploadCard() {
    var cardfile = document.getElementById("cardfile").files[0];
    var cardname = cardfile.name.replace(/\.\w*/i, "");
    var xhr = new XMLHttpRequest();
    var walletapi = "https://blockchain.arich-net.com/api/wallet/import";
    var params = "?name=" + cardname;
    var formData = new FormData();
    formData.append('card', cardfile);

    xhr.open("POST", walletapi + params, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('X-Access-Token', accessToken);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 204) {
            getParticipantID();
        }
    };
    xhr.send(formData);
}