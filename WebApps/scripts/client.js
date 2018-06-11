var sessionToken = false;
window.onload = function () {
    sessionToken = verifySessionToken();
    if (sessionToken == false) {
        window.location.replace("Login.htm");
    }
};

$(document).ready(function () {
    $(".loader").hide();

    $("#dateBirth").datepicker({
        uiLibrary: 'bootstrap4',
        format: 'dd.mm.yyyy'
    });

    var longitude = 0;
    var latitude = 0;
    var esriUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";
    var addresses = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace,
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            url: esriUrl + "suggest?f=json&text=%QUERY&countryCode=CHE&category=Address",
            filter: function (response) {
                return $.map(response.suggestions, function (address) {
                    return {
                        address: address.text,
                        magicKey: address.magicKey
                    }
                });
            },
            wildcard: '%QUERY'
        }
    });
    addresses.initialize();

    $("#bloodhound .typeahead").typeahead({
        hint: true,
        highlight: true,
        minLength: 3
    }, {
            name: 'address',
            displayKey: 'address',
            source: addresses.ttAdapter(),
            templates: {
                pending: function (query) {
                    return "<div>  Loading...</div>"
                }
            }
        }
    );

    $(".typeahead").bind('typeahead:select', function (ev, suggestions) {
        var request = $.getJSON(esriUrl + "findAddressCandidates",
            { "f": "json", 'magicKey': suggestions.magicKey });
        request.done(function (data){
            var position = data.candidates[0];
            latitude = position.location.y;
            longitude = position.location.x;
        });
    });

    $("#newForm").click(function(){
        $("#mortForm").trigger('reset');
        $("#mortgageStatus").modal('hide');
    });

    $("form").submit(function (event) {
        event.preventDefault();
        submit();
        sendForm();
    });


    function submit(){
        $('#submit').html("Submitting...");
        $('#fieldset').prop('disabled', true);
        $('.loader').show();
    }

    function complete(){
        $('#submit').html("Submit");
        $('#fieldset').prop('disabled', false);
        $('.loader').hide();
        $("#mortgageStatus").modal('show');

    }

    function createRequest(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-Access-Token', sessionToken);
        return xhr
    }

    function sendForm() {
        var uniqueId = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + Date.now();
        var user = {
            "$class": "org.real.hackers.Customer",
            "customerId": uniqueId,
            "firstName": $("#fname").val(),
            "lastName": $("#lname").val(),
            "dateOfBirth": "1979-03-16T20:17:54.264Z"
        };

        var url = "https://blockchain.arich-net.com/api/Customer";
        xhr = createRequest(url);
        console.log(user);
        xhr.send(JSON.stringify(user));
        xhr.onloadend = function () {
            var url = "https://blockchain.arich-net.com/api/Application";
            xhr2 = createRequest(url);
            application = {
                "$class": "org.real.hackers.Application",
                "appId": "app-" + uniqueId,
                "customer": "org.real.hackers.Customer#" + uniqueId,
                "creditHistory": "none",
                "propertyName": $('#address').val(),
                "fundingRequest": parseInt($('#loanInput').val()),
                "latitude": latitude,
                "longitude": longitude,
                "duration": 1,
                "signatures": [],
                "applicationStatus": 0
            }
            console.log(application);
            xhr2.send(JSON.stringify(application));
            complete();
        }
    }
});
