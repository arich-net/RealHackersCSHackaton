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