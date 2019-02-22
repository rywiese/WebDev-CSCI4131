function validateName(name) {
    var ok = name.search(/[a-z0-9]+$/i);
    if(ok == 0) {
        return true;
    }
    else return false;
}
function validateForm() {
    var nameOK = validateName(document.forms["form"]["Event Name"].value);
    if(nameOK == false) {
        alert("Event Name must be alphanumeric");
        return false;
    }
    var eventOK = validateName(document.forms["form"]["Location"].value);
    if(eventOK == false) {
        alert("Location must be alphanumeric");
        return false;
    }
}

var map;
var markers = [];
var infowindow;
var campus = {lat: 44.9727, lng: -93.23540000000003};
var geocoder;
function initMap() {
    map = new google.maps.Map(
        document.getElementById('formMap'), {zoom: 14, center: campus});
    geocoder = new google.maps.Geocoder();

    var input = document.getElementById("formLocation");
    var autocomplete = new google.maps.places.Autocomplete(input);

    var clickHandler = new ClickEventHandler(map, campus);
}

var ClickEventHandler = function(map, origin) {
        this.origin = origin;
        this.map = map;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(map);
        this.placesService = new google.maps.places.PlacesService(map);
        this.infowindow = new google.maps.InfoWindow;
        this.infowindowContent = document.getElementById('infowindow-content');
        this.infowindow.setContent(this.infowindowContent);

        // Listen for clicks on the map.
        this.map.addListener('click', this.handleClick.bind(this));
      };

      ClickEventHandler.prototype.handleClick = function(event) {
        console.log('You clicked on: ' + event.latLng);
        // If the event has a placeId, use it.
        if (event.placeId) {
          console.log('You clicked on place:' + event.placeId);

          // Calling e.stop() on the event prevents the default info window from
          // showing.
          // If you call stop here when there is no placeId you will prevent some
          // other map click event handlers from receiving the event.
          event.stop();
          //this.calculateAndDisplayRoute(event.placeId);
          this.getPlaceInformation(event.placeId);
        }
      };

ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
    var me = this;
    this.placesService.getDetails({placeId: placeId}, function(place, status) {
        if (status === 'OK') {
            document.getElementById("formLocation").value = place.formatted_address;
        }
    });
};

/*

    alert('executing');
    if(status === "OK") {
        alert(place.formatted_address);
        document.getElementById("formLocation").value = place.formatted_address;
    }
    */
