$(document).on('click', 'a#pickupRadio', function() {
  $('a#pickupRadio').addClass('active')
  $('a#deliveryRadio').removeClass('active')
  localStorage.setItem("fulfillment_method", "pickup")
    $("#modal-pickup").addClass("is-active")
    var cords = document.getElementById("cords").value;
    var cord = cords.split(",");
  
    // Using mapbox to sort and order our list of locations based on how far they are from main store.
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA";

      // Make sure we are measuring miles and not kilometers
      var options = {
        units: "miles"
      };

      // Initial search is taking in user coordinates from Geolocation.  Need to add a fallback in
      // case user denies gelocation request.
      var searchResult = {"type":"Point","coordinates":cord}
      stores.features.forEach(function(store) {
        Object.defineProperty(store.properties, "distance", {
          value: turf.distance(searchResult, store.geometry, options),
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      
      // Sort stores based on distance from geolocation.
      stores.features.sort(function(a, b) {
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
        var sortedLons = lons.sort(function(a, b) {
          if (a > b) {
            return 1;
          }
          if (a.distance < b.distance) {
            return -1;
          }
          return 0;
        });
        var sortedLats = lats.sort(function(a, b) {
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
            if (stores.features[i].properties.storeId != pickupLocation.storeId && miles) {
            listing.innerHTML = "<div class='list-item' data-storeId='"+i+"' data-store='"+prop.desc+"'>"+prop.desc+"<span class='store-hours is-pulled-right'>OPEN TILL "+formatDate(prop.closing)+"</span><br />"+prop.address+" <span class='miles is-pulled-right'><strong>"+ miles.toFixed(1) +"</strong> miles away</span></div>"
          } else {
            listing.innerHTML = "<div class='list-item active' data-storeId='"+i+"' data-store='"+prop.desc+"'>"+prop.desc+"<span class='store-hours is-pulled-right'>OPEN TILL "+formatDate(prop.closing)+"</span><br />"+prop.address+" <span class='miles is-pulled-right'><strong>"+ miles.toFixed(1) +"</strong> miles away</span></div>"
  
          }
        } else {
  
            listing.innerHTML = "<div class='list-item' data-storeId='"+i+"' data-store='"+prop.desc+"'>"+prop.desc+"<span class='store-hours is-pulled-right'>OPEN TILL "+formatDate(prop.closing)+"</span><br />"+prop.address+" <span class='miles is-pulled-right'><strong>"+ miles.toFixed(1) +"</strong> miles away</span></div>"
  
        }
  
  
      }
    }
  
    // Handle when a user clicks on a store location to set it as their preference.
    $(".list-item").on('click', function(){
      $(".list-item").removeClass("active")
      var st = ($(this).data())
      var myStore = {}
      myStore.id = st.storeid
      myStore.name = st.store
      localStorage.myStore = JSON.stringify(myStore)
      $('.modal').removeClass("is-active")
      localStorage.pickupLocation = JSON.stringify(stores.features[st.storeid].properties)
        if (localStorage.checkoutInitiated == 1) {
          $(".modal").removeClass("is-active")
          // nextAvalFulfill()
          // $("#modal-pickup-day").addClass("is-active")
          $('.store-desc').html(JSON.parse(localStorage.myStore).name)
        }
        updateCartDiv()
        $('#pickupRadio').addClass('active')
        $('#deliveryRadio').removeClass('active')
    })

  
    $("#modal-initial-click").removeClass("is-active");
    // $("#modal-pickup").addClass("is-active");
  })


  $(document).on('click', '#pickup', function() {
    $('a#pickupRadio').addClass('active')
    $('a#deliveryRadio').removeClass('active')
    localStorage.setItem("fulfillment_method", "pickup")
      $("#modal-pickup").addClass("is-active")
      var cords = document.getElementById("cords").value;
      var cord = cords.split(",");
    
      // Using mapbox to sort and order our list of locations based on how far they are from main store.
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2lqbmpqazdlMDBsdnRva284cWd3bm11byJ9.V6Hg2oYJwMAxeoR9GEzkAA";
  
        // Make sure we are measuring miles and not kilometers
        var options = {
          units: "miles"
        };
  
        // Initial search is taking in user coordinates from Geolocation.  Need to add a fallback in
        // case user denies gelocation request.
        var searchResult = {"type":"Point","coordinates":cord}
        stores.features.forEach(function(store) {
          Object.defineProperty(store.properties, "distance", {
            value: turf.distance(searchResult, store.geometry, options),
            writable: true,
            enumerable: true,
            configurable: true
          });
        });
        
        // Sort stores based on distance from geolocation.
        stores.features.sort(function(a, b) {
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
          var sortedLons = lons.sort(function(a, b) {
            if (a > b) {
              return 1;
            }
            if (a.distance < b.distance) {
              return -1;
            }
            return 0;
          });
          var sortedLats = lats.sort(function(a, b) {
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
              if (stores.features[i].properties.storeId != pickupLocation.storeId && miles) {
              listing.innerHTML = "<div class='list-item' data-storeId='"+i+"' data-store='"+prop.desc+"'>"+prop.desc+"<span class='store-hours is-pulled-right'>OPEN TILL "+formatDate(prop.closing)+"</span><br />"+prop.address+" <span class='miles is-pulled-right'><strong>"+ miles.toFixed(1) +"</strong> miles away</span></div>"
            } else {
              listing.innerHTML = "<div class='list-item active' data-storeId='"+i+"' data-store='"+prop.desc+"'>"+prop.desc+"<span class='store-hours is-pulled-right'>OPEN TILL "+formatDate(prop.closing)+"</span><br />"+prop.address+" <span class='miles is-pulled-right'><strong>"+ miles.toFixed(1) +"</strong> miles away</span></div>"
    
            }
          } else {
    
              listing.innerHTML = "<div class='list-item' data-storeId='"+i+"' data-store='"+prop.desc+"'>"+prop.desc+"<span class='store-hours is-pulled-right'>OPEN TILL "+formatDate(prop.closing)+"</span><br />"+prop.address+" <span class='miles is-pulled-right'><strong>"+ miles.toFixed(1) +"</strong> miles away</span></div>"
    
          }
    
    
        }
      }
    
      // Handle when a user clicks on a store location to set it as their preference.
      $(".list-item").on('click', function(){
        $(".list-item").removeClass("active")
        var st = ($(this).data())
        var myStore = {}
        myStore.id = st.storeid
        myStore.name = st.store
        localStorage.myStore = JSON.stringify(myStore)
        $('.modal').removeClass("is-active")
        localStorage.pickupLocation = JSON.stringify(stores.features[st.storeid].properties)
          if (localStorage.checkoutInitiated == 1) {
            $(".modal").removeClass("is-active")
            // nextAvalFulfill()
            // $("#modal-pickup-day").addClass("is-active")
            $('.store-desc').html(JSON.parse(localStorage.myStore).name)
          }
          updateCartDiv()
          $('#pickupRadio').addClass('active')
          $('#deliveryRadio').removeClass('active')
      })
  
    
      $("#modal-initial-click").removeClass("is-active");
      // $("#modal-pickup").addClass("is-active");
    })