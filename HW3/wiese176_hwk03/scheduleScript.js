function changeGoldy(image) {
    document.getElementById('goldy').src = image;
}
function show(id) {
    document.getElementById(id).style.display = 'inline';
}
function hide(id) {
    document.getElementById(id).style.display = 'none';
}
var ivl;
var pictures = ["cive", "keller", "me", "smith"];
var i = 0;
function changeSlide() {
    changeGoldy("images/" + pictures[i] + ".jpg");
    i = (i + 1) % 4;
}
function startSlideshow() {
    stopSlideshow();
    changeSlide();
    ivl = setInterval(function(){changeSlide()}, 2000);
}
function stopSlideshow() {
    clearInterval(ivl);
}
var map;
var markers = [];
var infowindow;
var geocoder;
var campus = {lat: 44.9727, lng: -93.23540000000003};
var destination = campus;
function placeMarker(element) {
    var address = element.getElementsByClassName('address')[0].innerHTML;
    var eventName = element.getElementsByClassName('eventName')[0].innerHTML;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
            //map.setCenter(results[0].geometry.location);
            var icon = {
                url: 'https://i.imgur.com/WD7TGey.png',
                scaledSize: new google.maps.Size(50, 50)
            };
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: icon
            });
            var contentString = '<p>' + eventName + '</p>';
            infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });
            markers.push(marker);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function removeMarkers () {
    for(var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}
function initMap() {
    // The map, centered at Uluru
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 14, center: campus});
    // The marker, positioned at Uluru
    //var marker = new google.maps.Marker({position: campus, map: map});
    geocoder = new google.maps.Geocoder();
    placeMarker(document.getElementById('smith'), map);
    placeMarker(document.getElementById('keller'), map);
    placeMarker(document.getElementById('me'), map);
    placeMarker(document.getElementById('cive'), map);

    var input = document.getElementById("destination");
    var searchBox = new google.maps.places.SearchBox(input);
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if(places.length == 0) {
            return;
        }
        destination = places[0].geometry.location;
    });
}
function itemSelected() {
    var findSelect = document.getElementById("findSelect");
    var val = findSelect.options[findSelect.selectedIndex].value;
    if(val == 'other') {
        document.getElementById('findInput').disabled = false;
    }
    else {
        document.getElementById('findInput').disabled = true;
    }
}
function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    markers.push(marker);

    google.maps.event.addListener(marker, 'mouseover', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        infowindow.close();
    });

}
function search() {
    removeMarkers();
    var findSelect = document.getElementById("findSelect");
    var type = findSelect.options[findSelect.selectedIndex].value;
    if(type == 'other') {
        var keyword = document.getElementById('findInput').value;
        request = {
            location: campus,
            radius: document.getElementById('findMeters').value,
            keyword: keyword
        };
    }
    else {
        request = {
            location: campus,
            radius: document.getElementById('findMeters').value,
            type: [type]
        };
    }

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                createMarker(results[i]);
            }
        }
        else {
            alert('Error');
        }
    });
}

var directionsDisplay;
var directionsService;
function directions() {
    if(directionsDisplay != null) {
        directionsDisplay.setMap(null);
    }
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById("dirList")
    });
    directionsService = new google.maps.DirectionsService;
    //directionsDisplay.setMap(map);

    var mode = function() {
        var butt = document.getElementById("walkRadio");
        if(butt.checked) {
            return butt.value;
        }
        butt = document.getElementById("driveRadio");
        if(butt.checked) {
            return butt.value;
        }
        butt = document.getElementById("transRadio");
        if(butt.checked) {
            return butt.value;
        }
    }();

    navigator.geolocation.getCurrentPosition(function(position){
        directionsService.route({
            origin: {lat: position.coords.latitude, lng: position.coords.longitude},
            destination: destination,
            travelMode: google.maps.TravelMode[mode]
        },
        function(response, status) {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
                resize();
            } else {
                alert('Directions request failed due to ' + status);
            }
        });
    });
}
function resize() {
    document.getElementById("dirList").style.visibility = "visible";
    document.getElementById("map").style.width = "600px";
}
