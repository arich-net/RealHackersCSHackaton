var access_token = "";

function isEmpty(str) {
      return (!str || 0 === str.length);
  }

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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
        window.location.replace("Login.htm");
    }
    else {
        //alert("Cookie: " + myCookie);
        var pivot = myCookie.match(/.*:([^\.]*).*/);
        access_token = pivot[1];
        setUserInterface();
        //document.getElementById("Participant").innerHTML = getParticipantID();
    }
}

window.onload = function() {
    verifySessionToken();
};