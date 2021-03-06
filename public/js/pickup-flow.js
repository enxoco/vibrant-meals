
$(document).on('click', '#pickupRadio', function () {

  showPickupLocations()
})

$(document).on('click', '#pickup', function () {
  $('#modal-initial-click').modal('hide')
  $('#pickupRadio').prop('checked', true)
  getLocation()

  showPickupLocations()
})



$(document).on('click', '#delivery', function () {

  localStorage.fulfillment_method = 'delivery'
  updateCartDiv()
  setTimeout(function () {
    $('#modal-initial-click').modal('toggle')
  }, 500);



})
$(document).on('click', '#deliveryRadio', function () {

  localStorage.fulfillment_method = 'delivery'
  $('.store-desc').html('')
  $('.delivery-desc').html('Select delivery address at checkout')
  // updateCartDiv()
})


function formatDate(date) {
  var time = date.split(":");
  var hh = parseInt(time[0]);
  var m = parseInt(time[1]);
  var h = hh;
  if (h >= 12) {
    h = hh - 12;
    dd = "PM";
  }
  if (h == 0) {
    h = 12;
  }

  m = m < 10 ? "0" + m : m;

  /* if you want 2 digit hours: */
  // h = h<10?"0"+h:h;
  var timeStr = h + ":" + m + "" + dd;
  return timeStr;
}

function getLocation() {
  if ($('.cords').val() != "") {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {

      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  if ($('#cords').val()) {
    var cords = $('#cords').val()
    var cord = cords.split(',')
    console.log(cord)
  } else {
    var cord = ["-85.317076", "35.068908"]
  }
}
function showPosition(position) {
  var cord = [];
  cord.push(position.coords.longitude);
  cord.push(position.coords.latitude);
  $("#cords").val(cord);
  localStorage.cords = cord
}
function showError(error) {
  getLocationByIp()
}
function getLocationByIp() {
  $.ajax({
    type: 'GET',
    url: 'https://icanhazip.com',
    success: function (res) {
      $.ajax({
        type: 'GET',
        url: 'http://api.ipstack.com/' + res + '?access_key=a30e90d0c810992415e2eb14c1e5e9bb&fields=longitude,latitude,zip',
        success: function (res) {
          var test = res.longitude + ',' + res.latitude
          $('#cords').val(test)
        }
      })
    }
  })
}


function showPickupLocations() {
  if (window.location.href.includes('checkout')) {
    $('#collapseTwo').removeClass('show')
    $('#collapseOne').addClass('show')
  }
  $('#pickupRadioMobile').click()
  $('.delivery-fee').html('0')
  $('.order-shipping').html('0')
  localStorage.shippingCode = 'freeshipping'
  var stores = $('#stores').data('stores')
  $('.express-checkout-edit').hide()
  $('.shipping-form').closest('.card').hide()

  localStorage.fulfillment_method = 'pickup'

  if ($('#cords').val()) {
    var cords = $('#cords').val()
    var cord = cords.split(',')
    console.log(cord)
  } else {
    var cord = ["-85.317076", "35.068908"]
  }



  // Using mapbox to sort and order our list of locations based on how far they are from main store.
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA";

  // Make sure we are measuring miles and not kilometers
  var options = {
    units: "miles"
  };


  // Initial search is taking in user coordinates from Geolocation.  Need to add a fallback in
  // case user denies gelocation request.
  var searchResult = { "type": "Point", "coordinates": cord }
  stores.features.forEach(function (store) {
    Object.defineProperty(store.properties, "distance", {
      value: turf.distance(searchResult, store.geometry, options),
      writable: true,
      enumerable: true,
      configurable: true
    });
  });

  // Sort stores based on distance from geolocation.
  stores.features.sort(function (a, b) {
    if (a.properties.distance > b.properties.distance) {
      return 1;
    }
    if (a.properties.distance < b.properties.distance) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  var listings = document.getElementById("listings");
  while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
  }
  buildLocationList(stores);

  function sortLonLat(storeIdentifier) {
    var lats = [
      stores.features[storeIdentifier].geometry.coordinates[1],
      searchResult.coordinates[1]
    ];
    var lons = [
      stores.features[storeIdentifier].geometry.coordinates[0],
      searchResult.coordinates[0]
    ];
    var sortedLons = lons.sort(function (a, b) {
      if (a > b) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });
    var sortedLats = lats.sort(function (a, b) {
      if (a > b) {
        return 1;
      }
      if (a.distance < b.distance) {
        return -1;
      }
      return 0;
    });

  }
  sortLonLat(0);
  // This is where your interactions with the symbol layer used to be
  // Now you have interactions with DOM markers instead

  // Generate the list of stores and distances and paint to DOM.
  function buildLocationList(data) {

    for (i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      var prop = currentFeature.properties;
      var listings = document.getElementById("listings");
      var listing = listings.appendChild(document.createElement("div"));
      listing.classList.add("listing-item")
      var miles = prop.distance
      if (localStorage.pickupLocation) {
        var pickupLocation = JSON.parse(localStorage.pickupLocation)
        if (stores.features[i].properties.storeId != pickupLocation.storeId) {
          listing.innerHTML = '<ul class="list-group">\
              <li class="list-group-item d-flex justify-content-between align-items-center" data-storeRank="'+ i + '" data-storeId="' + prop.storeId + '" data-store="' + prop.desc + '">\
                '+ prop.desc + '<br />' + prop.address + '\
                <span class="badge badge-secondary">Open till '+ prop.close + ' <br /> <br />' + miles.toFixed(1) + ' Miles away</span>\
              </li>\
            </ul>'
        } else {
          listing.innerHTML = '<ul class="list-group">\
            <li class="list-group-item active d-flex justify-content-between align-items-center" data-storeRank="'+ i + '" data-storeId="' + prop.storeId + '" data-store="' + prop.desc + '">\
            '+ prop.desc + '<br />' + prop.address + '\
              <span class="badge badge-secondary">Open till '+ prop.close + ' <br /><br />' + miles.toFixed(1) + ' Miles away</span>\
            </li>\
          </ul>'
        }
      } else {

        listing.innerHTML = '<ul class="list-group">\
          <li class="list-group-item d-flex justify-content-between align-items-center" data-storeRank="'+ i + '" data-storeId="' + prop.storeId + '" data-store="' + prop.desc + '">\
            '+ prop.desc + '<br />' + prop.address + '\
            <span class="badge badge-secondary">Open till '+ prop.close + ' <br /> <br />' + miles.toFixed(1) + ' Miles away</span>\
          </li>\
        </ul>'
      }
    }
  }

  // Handle when a user clicks on a store location to set it as their preference.
  $('.list-group-item').on('click', function () {
    $('#listings').find('.list-group-item.active').removeClass('active')
    $($(this)).addClass("active")
    setTimeout(function () {
      $('#modal-pickup').modal('toggle')
    }, 500);

    var st = ($(this).data())
    var myStore = {}

    myStore.id = st.storeid
    myStore.name = st.store

    localStorage.myStore = JSON.stringify(myStore)
    localStorage.fulfillment_method = 'pickup'
    $('.store-desc').html('<strong>Pickup Location</strong><br>' + JSON.parse(localStorage.myStore).name)

    $('#user-info').remove()
    var userInfo = {
      fulfillment_method: 'pickup',
      fulfillment_day: localStorage.fulfillment_day
    }


    localStorage.pickupLocation = JSON.stringify(stores.features[st.storerank].properties)

    $('body').append("<div id='user-info-updated' data-user='" + JSON.stringify(userInfo) + "'></div>")



    if (localStorage.checkoutInitiated == 1) {
      // nextAvalFulfill()
      // $("#modal-pickup-day").addClass("is-active")
      $('#pickup-label').html(st.store)
      $('.store-desc').html('<strong>Pickup Location</strong><br>' + JSON.parse(localStorage.myStore).name)
      $('.delivery-desc').html('')
    }
    // if ($('#fulfillmentOptions').children() && $('#fulfillmentOptions').children()[0].innerHTML === 'Pickup') {
    //   $('#fulfillmentOptions').children()[0].innerHTML += ' at ' + JSON.parse(localStorage.myStore).name

    // }

    
  })
}