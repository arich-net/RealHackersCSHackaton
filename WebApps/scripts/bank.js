function createMap() {
    var rhMap = L.map('csMap');
    var stdStlye = {
        "radius": 5,
        "fillColor": "#c32121",
        "color": "#c32121",
        "weight": 1,
        "fillOpacity": 0.8
    };
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(rhMap);
    rhMap.setView([47.35668, 8.51476], 13);
    return rhMap;
}

function calcHeight() {
    var tableHeight = $('#csTable').height();
    var tableWHeight = $('.dataTables_wrapper').height();
    var scrollHeight = $('.dataTables_scrollBody').height();
    if (tableWHeight > tableHeight) {
        var diff = tableWHeight - scrollHeight;
        $('.dataTables_scrollBody').height(tableHeight - diff - 1);
    }
}

function addToMap(jsonObject, map) {
    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };
    var layer = L.geoJSON(createGeoJson(jsonObject), {
        style: myStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup('<h4>' + feature.properties.PropertyDescription + '</h4><p>Id: ' + feature.properties.appId + '<br>Funding request: ' + feature.properties.fundingRequest + '</p>');
        }
    });
    layer.addTo(map);
    map.fitBounds(layer.getBounds());
}

function createGeoJson(jsonObject) {
    var geoJson = [];
    $(jsonObject).each(function () {
        var feature = {
            "type": "Feature",
            "properties": {
                "appId": this.appId,
                "fundingRequest": this.fundingRequest,
                "PropertyDescription": this.propertyName
            },
            "geometry": {
                "type": "Point",
                "coordinates": [this.longitude, this.latitude]
            }
        };
        geoJson.push(feature)
    });
    return geoJson;
}

function sendValidation(appId, company, handwriting) {
    var xhr2 = new XMLHttpRequest();
    var url = "https://blockchain.arich-net.com/api/Validation";
    xhr2.open("POST", url, true);
    xhr2.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr2.setRequestHeader('X-Access-Token', accessToken);
    validation = {
        "$class": "org.real.hackers.Validation",
        "application": "org.real.hackers.Application#" + appId,
        "signature": {
            "$class": "org.real.hackers.Signature",
            "theDate": "2018-03-16T20:29:08.310Z",
            "name": company,
            "handwriting": handwriting
        }
    }
    xhr2.send(JSON.stringify(validation));
    xhr2.onloadend = function () {
        document.getElementById("loadAnimation").style = "display:none;";
        setUserInterface();
    };
}

var sessionToken = false;
var csMap;
var appId;
var csTable;
window.onload = function () {
    sessionToken = verifySessionToken();
    if (sessionToken == false) {
        //window.location.replace("Login.htm");
    }
};

$(document).ready(function () {

    var status = function (data, type, row) {
        if (type === 'display') {
            var text = '<i class="fa fa-circle"/> [' + data + ']</p>'
            if (data == 3) return '<p class="text-success">' + text;
            if (data > 1) return '<p class="text-warning">' + text;
            return '<p class="text-secondary">' + text;
        }
        return data;
    };

    var csTable = $('#detailData').DataTable({
        "processing": true,
        "select": true,
        "ajax": {
            "url": "json/selectBankStatusAll.json",
            "dataSrc": ''
        },
        "initComplete": initTableComplete,
        "paging": false,
        "scrollY": '300',
        "scrollX": false,
        "scrollColapse": true,
        "columns": [
            { "data": 'appId' },
            { "data": 'customer' },
            { "data": 'propertyName' },
            { "data": 'fundingRequest' },
            { "data": 'applicationStatus', 'render': status },
            { "data": '' },
            { "data": 'longitude' },
            { "data": 'latitude' }
        ],
        "columnDefs": [{
            "orderable": false,
            "targets": -3,
            "defaultContent": '<button type="button" class="btn btn-secondary btn-sm">Sign</button>'
        },
        {
            "targets": [-2, -1],
            "visible": false,
            "searchable": false
        }]
    });

    $('#detailData tbody').on('click', 'button', function () {
        var row = csTable.row($(this).parents('tr')).data();
        appId = row.appId;
        $('#signModal').modal('show');
    });

    $('#signBtn').on('click', function (evt) {
        console.log(appId);
        console.log($('#bank').val());
        console.log($('#bank-dep').val());
        console.log($('#bank-name').val());
    });

    $(window).resize(function () {
        calcHeight();
        csTable.redraw();
    });

    $('#detailData tbody').on('click', 'tr', function () {
        var row = csTable.row(this).data();
        csMap.setView([row.latitude, row.longitude], 13);
        console.log(row);
    });

    csMap = createMap();
    function initTableComplete(settings, json) {
        calcHeight();
        addToMap(json, csMap)
    }

});