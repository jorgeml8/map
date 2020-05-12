var MAPAPP = {};
MAPAPP.markers = [];
MAPAPP.currentInfoWindow;
MAPAPP.pathName = window.location.pathname;

$(document).ready(function() {
    initialize(MAPAPP.pathName);
    //populateMarkers(MAPAPP.pathName);
});


function FontAwesomeMarker(latlng, map, args) {
	this.latlng = latlng;	
	this.args = args;	
	this.setMap(map);	
}

FontAwesomeMarker.prototype = new google.maps.OverlayView();

FontAwesomeMarker.prototype.draw = function() {
	var self = this,
  	panes = this.getPanes(),
  	marker = this.marker;
	
	if (!marker) {
	  marker = this.marker = document.createElement('div');
		marker.className = 'marker';
		
    var icon = document.createElement('i');
    icon.className = 'fa fa-' + this.args.icon;
    icon.style.fontSize = this.args.fontSize;
    icon.style.color = this.args.color;
    marker.appendChild(icon);
    
    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
    if (point) {
      marker.style.left = (point.x - 25) + 'px';
      marker.style.top = (point.y - 25) + 'px';
    }
    
		google.maps.event.addDomListener(marker, "click", function(event) {
			alert('You clicked on a custom marker!');			
			google.maps.event.trigger(self, "click");
		});

		panes.overlayImage.appendChild(marker);
	}
};

FontAwesomeMarker.prototype.remove = function() {
	if (this.marker) {
		this.marker.parentNode.removeChild(this.marker);
		this.marker = null;
	}	
};

FontAwesomeMarker.prototype.getPosition = function() {
	return this.latlng;	
};

function initialize(dataType) {
	var myLatlng = new google.maps.LatLng(-33.9,151.2),
    mapOptions = {
      zoom: 15,
      center: myLatlng,
      disableDefaultUI: true
    };
	
  var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  


  apiLoc = typeof apiLoc !== 'undefined' ? apiLoc : '/data/' + dataType + '.json';
  $.getJSON(apiLoc, function(data) {
    //For each item in our JSON, add a new map marker
    $.each(data, function(i, ob) {
        var marker = new google.maps.Marker({
            //map: map,
            latLan: new google.maps.LatLng(this.location.coordinates[0], this.location.coordinates[1]),
            shopname: this.shopname,
            details: this.details,
            website: this.website,
            icon: this.icon,
            color: this.color,
            fontSize: '35px'
        });

  

        MAPAPP.markers.push(marker);
        
      });
    });
/*
  var markers = [
  	{
      latLan: new google.maps.LatLng(-33.9,151.2),
      icon: 'cutlery',
      color: '#346698',
      fontSize: '35px'
    },
    {
     	latLan: new google.maps.LatLng(-33.8939,151.207333),
      icon: 'anchor',
      color: '#B90C13',
      fontSize: '35px'
    },
    {
      latLan: new google.maps.LatLng(-33.895,151.195),
      icon: 'automobile',
      color: '#39A00F',
      fontSize: '35px'
    },
    {
      latLan: new google.maps.LatLng(-33.905,151.195),
      icon: 'headphones',
      color: '#000',
      fontSize: '35px'
    },
     {
     	latLan: new google.maps.LatLng(-33.9039,151.207333),
      icon: 'child',
      color: '#26C2C3',
      fontSize: '35px'
    },
  ]*/
  
  MAPAPP.markers.forEach(function(item) {
    new FontAwesomeMarker(
      item.latLan, 
      map,
      {
        icon: item.icon,
        color: item.color,
        fontSize: item.fontSize
      }
    );
  });
  
}

google.maps.event.addDomListener(window, 'load', initialize);
