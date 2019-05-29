L.mapbox.accessToken = 'pk.eyJ1IjoiaGFubGV5d29vZCIsImEiOiJZcVlldnlRIn0.BHYD98R8UQQoUBLsNd8ksg';


var geojson = [
	{
"type": "FeatureCollection",
"features": [
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-85.317076",
"35.068908"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "601 Cherokee Blvd",
"postalCode": 37405,
"state": "TN",
"city": "Chattanooga",
"close": "6:30pm",
"opens": "8:00am",
"desc": "Vibrant Meals Kitchen",
"storeId": 12
}
},
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-85.312839",
"35.049675"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "301 West 6th Street",
"postalCode": 37402,
"state": "TN",
"city": "Chattanooga",
"close": "8:00pm",
"opens": "10:00am",
"desc": "Downtown YMCA",
"storeId": 13
}
},
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-85.3136527",
"35.0385917"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "525 West Main Street",
"postalCode": 37402,
"state": "TN",
"city": "Chattanooga",
"close": "2:30pm",
"opens": "9:30am",
"desc": "Kyle House Fitness",
"storeId": 14
}
},
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-85.1484745",
"35.0034941"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "8142 E Brainerd Rd",
"postalCode": 37421,
"state": "TN",
"city": "Chattanooga",
"close": "7:00pm",
"opens": "4:00pm",
"desc": "Crossfit Brigade East",
"storeId": 15
}
},
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-85.1780835",
"35.0350449"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "6413 Lee Hwy #113",
"postalCode": 37421,
"state": "TN",
"city": "Chattanooga",
"close": "7:00pm",
"opens": "4:00pm",
"desc": "Burn Bootcamp",
"storeId": 16
}
},
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-84.8762426",
"35.1575936"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "282 Church St SE",
"postalCode": 37311,
"state": "TN",
"city": "Cleveland",
"close": "5:00pm",
"opens": "4:00pm",
"desc": "Body By Hannah",
"storeId": 17
}
},
{
"type": "Feature",
"geometry": {
"type": "Point",
"coordinates": [
"-84.8524849",
"35.1507661"
]
},
"properties": {
"phoneFormatted": "(423) 555-5555",
"phone": "4235555555",
"address": "5806 Waterlevel Hwy",
"postalCode": 37311,
"state": "TN",
"city": "Cleveland",
"close": "5:00pm",
"opens": "4:00pm",
"desc": "Crossfit Anistemi",
"storeId": 20
}
}
]
}
]
  var map = L.mapbox.map('map', 'hanleywood.kv1s8aor')
  .setView([35.06887,-85.31696], 8);  
      
//      var map = L.mapbox.map('map', 'examples.map-i80bb8p3')
//  .setView([33.7677129, -84.4006039], 13);

  map.scrollWheelZoom.disable();

  var listings = document.getElementById('listings');
  var locations = L.mapbox.featureLayer().addTo(map);

  locations.setGeoJSON(geojson);

  function setActive(el) {
    var siblings = listings.getElementsByTagName('div');
    for (var i = 0; i < siblings.length; i++) {
      siblings[i].className = siblings[i].className
      .replace(/active/, '').replace(/\s\s*$/, '');
    }

    el.className += ' active';
  }

  locations.eachLayer(function(locale) {

    // Shorten locale.feature.properties to just `prop` so we're not
    // writing this long form over and over again.
    var prop = locale.feature.properties;

    // Each marker on the map.
    var popup ='<img src="' + prop.image + '" />' +'<h3>'+ prop.property + '</h3>';

    var listing = listings.appendChild(document.createElement('div'));
    listing.className = 'item';

    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';

    link.innerHTML = prop.desc;
    if (prop.desc) {
      link.innerHTML += '</br><small class="quiet">' + prop.address + '</small>';
      popup += '<small class="quiet boxtop">' + prop.address + '</small>' + '<br>' + '<small class="box">ORA Score: ' + prop.closing_time + '</small>' + '<br>' + '<small class="box">Rank: ' + prop.rank + '</small>' + '<br>' + '<h4 class="box">' + prop.firm + '</h4>'+ '<br>'+'<a target="_blank" class="url" href="' + prop.url + '">' + prop.websiteText + '</a>';
    }

    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.opens + ' - ' + prop.close
    if (prop.websiteURL) {
      details.innerHTML;
    }

    link.onclick = function() {
      setActive(listing);

      // When a menu item is clicked, animate the map to center
      // its associated locale and open its popup.
      map.setView(locale.getLatLng(), 16);
      locale.openPopup();
      return false;
    };

    // Marker interaction
    locale.on('click', function(e) {
      // 1. center the map on the selected marker.
      map.panTo(locale.getLatLng());

      // 2. Set active the markers associated listing.
      setActive(listing);
    });

    popup += '</div>';
    locale.bindPopup(popup);


});