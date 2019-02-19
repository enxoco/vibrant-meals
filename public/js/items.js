$(document).ready(function(){

    if (localStorage.fulfillment_method == 'pickup') {
      $('a#pickupRadio').addClass('active')
      $('a#deliveryRadio').removeClass('active')
    } else if(localStorage.fulfillment_method == 'delivery') {
      $('a#pickupRadio').removeClass('active')
      $('a#deliveryRadio').addClass('active')
    }
    $('.modal-close').on('click', function(){
      $('.modal').removeClass('is-active')
    })

  })
var total = 0
for (var i = 0; i < 50; i++) {
  var price = $('#subtotal-' + i).text()
  price = parseFloat(price.replace('$', ''))
  if (price) {
    total += price
  }
}
var cartItems = []
function showCartmenu() {
  var cart = $('#cart')
  var items = $('#items-column')
  var item = $('.item-column')
  if (cart.hasClass('is-hidden-mobile') || cart.hasClass('is-hidden-tablet')) {
    // Show the cart div and make it half screen
    cart.addClass('cart-mobile')
    cart.removeClass('is-hidden-mobile').fadeIn()
    cart.removeClass('is-hidden-tablet').fadeIn()
    items.removeClass('is-full-mobile')
    items.removeClass('is-full-tablet')
    items.addClass('is-two-thirds-mobile')
    items.addClass('is-two-thirds-tablet')


  } else {
    // hide the cart div
    cart.addClass('is-hidden-mobile').fadeIn()
    cart.addClass('is-hidden-tablet').fadeIn()
    cart.addClass('is-hidden-mobile').fadeIn()
    cart.addClass('is-hidden-tablet').fadeIn()
    items.addClass('is-full-mobile')
    items.addClass('is-full-tablet')
    items.removeClass('is-two-thirds-mobile')
    items.removeClass('is-two-thirds-tablet')
  }

}


$(".modal-close").click(function() {
$("[class*='is-active']").removeClass("is-active");
});

var prefs = {};
var stores = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: ["-85.3171557", "35.0691112"]
      },
      properties: {
        phoneFormatted: "(423) 555-5555",
        phone: "4235555555",
        address: "601 Cherokee Blvd",
        postalCode: 37405,
        state: "TN",
        city: "Chattanooga",
        closing: "20:00",
        desc: "Vibrant Meals Kitchen",
        storeId: 1
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: ["-85.3106732", "35.0641196"]
      },
      properties: {
        phoneFormatted: "(423) 555-5555",
        phone: "4235555555",
        address: "125 Cherokee Blvd",
        postalCode: 37405,
        state: "TN",
        city: "Chattanooga",
        closing: "20:00",
        desc: "Chattanooga Functional Fitness",
        storeId: 2
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: ["-85.31406600000003", "35.0389277"]
      },
      properties: {
        phoneFormatted: "(423) 555-5555",
        phone: "4235555555",
        address: "525 West Main Street",
        postalCode: 37402,
        state: "TN",
        city: "Chattanooga",
        closing: "20:00",
        desc: "Kyle House Fitness",
        storeId: 3
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: ["-84.76723400000003", "35.134262"]
      },
      properties: {
        phoneFormatted: "(423) 555-5555",
        phone: "4235555555",
        address: "5806 Waterlevel Highway",
        postalCode: 37323,
        state: "TN",
        city: "Cleveland",
        closing: "20:00",
        desc: "Crossfit Anistemi",
        storeId: 4
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: ["-84.8766215", "35.157391"]
      },
      properties: {
        phoneFormatted: "(423) 555-5555",
        phone: "4235555555",
        address: "282 Church St SE",
        postalCode: 37311,
        state: "TN",
        city: "Cleveland",
        closing: "20:00",
        desc: "Body By Hannah",
        storeId: 5
      }
    }
  ]
};


$('#delivery').click(function(){
localStorage.setItem("fulfillment_method", "delivery")
$("#modal-initial-click").removeClass("is-active");
$("#modal-delivery").removeClass("is-active")
})



function getLocation() {
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showPosition);
  console.log('getting cords')
} else {
  console.log('error')
  x.innerHTML = "Geolocation is not supported by this browser.";
}
}
function showPosition(position) {
var cord = [];
cord.push(position.coords.longitude);
cord.push(position.coords.latitude);
console.log(cord)
$("#cords").val(cord);
}

getLocation()


$('.checkout-prompt-1').on('click', function(e){
e.preventDefault()
e.stopPropagation()
$('.modal').removeClass('is-active')
if (localStorage.getItem("custEngageCompleted") != 1) {
    $('#modal-initial-click').addClass('is-active')
    localStorage.setItem("custEngageCompleted", 1);
    var c = JSON.parse(localStorage.cart)
    var item = $(this).data()
    c.push(item)
    localStorage.setItem('cart', JSON.stringify(c))
    updateCartDiv()
    return false
  }
  var item = $(this).data()

// var item = $(this).data()
  var cartItems = JSON.parse(localStorage.cart)
  cartItems.push(item)

  function checkDuplicateInObject(propertyName, inputArray) {
  var seenDuplicate = false,
      testObject = {};
  
  inputArray.map(function(item) {
    var itemPropertyName = item[propertyName]; 
    if (itemPropertyName in testObject) {
      testObject[itemPropertyName].quantity++;
      item.duplicate = true;
      seenDuplicate = true;
    }
    else {
      testObject[itemPropertyName] = item;
      delete item.duplicate;
    }
  });
  
  return cartItems;
}
var cart = checkDuplicateInObject('id', cartItems)
var updatedCart = []
for (var i = 0; i < cart.length; i++) {
  if (!cart[i].duplicate){
    updatedCart.push(cart[i])
  }
  
}
  localStorage.setItem('cart', JSON.stringify(updatedCart))
  updateCartDiv()
})


// Checkout button inside modal
function addToCartFromModal(item){
  item.quantity = 1
  $('.modal').removeClass('is-active')
if (localStorage.getItem("custEngageCompleted") != 1) {
    $('#modal-initial-click').addClass('is-active')
    localStorage.setItem("custEngageCompleted", 1);
    var c = JSON.parse(localStorage.cart)
    // var item = $(this).data()
    c.push(item)
    localStorage.setItem('cart', JSON.stringify(c))
    updateCartDiv()
    return false
  }
  // var item = $(this).data()

// var item = $(this).data()
  var cartItems = JSON.parse(localStorage.cart)
  cartItems.push(item)

  function checkDuplicateInObject(propertyName, inputArray) {
  var seenDuplicate = false,
      testObject = {};
  
  inputArray.map(function(item) {
    var itemPropertyName = item[propertyName]; 
    if (itemPropertyName in testObject) {
      testObject[itemPropertyName].quantity++;
      item.duplicate = true;
      seenDuplicate = true;
    }
    else {
      testObject[itemPropertyName] = item;
      delete item.duplicate;
    }
  });
  
  return cartItems;
}
var cart = checkDuplicateInObject('id', cartItems)
var updatedCart = []
for (var i = 0; i < cart.length; i++) {
  if (!cart[i].duplicate){
    updatedCart.push(cart[i])
  }
  
}
  localStorage.setItem('cart', JSON.stringify(updatedCart))
  updateCartDiv()
}


//Initializd our cart if one is not yet set
if (!localStorage.cart) {
localStorage.setItem('cart','[]')
updateCartDiv()
} else {
var cart = JSON.parse(localStorage.cart)
updateCartDiv()
}
if (!localStorage.custEngageCompleted) {
localStorage.setItem('custEngageCompleted', 0)
}

if (!localStorage.cartCount) {
localStorage.setItem('cartCount', 0)
}


// This will run on page load
if (!localStorage.fulfillmentMethod && localStorage.pickupLocation) {
var store = JSON.parse(localStorage.pickupLocation)
$('#pickupRadio').html('<div class="cart-icon"><img src="/images/pickup-icon.png" alt="img"/></div><div class="cart-icon-label"><div>'+store.desc+'</div></div>')


}

(function() {
      var burger = document.querySelector('.burger');
      var nav = document.querySelector('#'+burger.dataset.target);

      burger.addEventListener('click', function(){
        var cart = $('.cart-container')
        if ($('.burger').hasClass('is-active')) {
          cart.css('display', 'none')
          $('.flex-container').css('width','100%')

        } else {
          cart.css('display', 'flex')
          cart.css('width', '')
          $('.flex-container').css('width','50%')
        }

        burger.classList.toggle('is-active');
        // nav.classList.toggle('is-active');
      });
    })();

    $('.card-content, .card-image').on('click',function(e){
      e.preventDefault()
      e.stopPropagation()
      $('#modal-item').addClass('is-active')
      var item = $(this).closest('li').data()
      $('.item-card-title').html('<img src="'+item.img_url+'"/>' + item.name)
      $('.item-card-description').html('<section class="item-description">'+item.desc + '</section>')
      $('.item-card-description').append("<a onclick='addToCartFromModal("+JSON.stringify(item)+")' data-quantity='1' class='is-pulled-right'><img src='/images/cart-icon.png' /></a>")
    })

    $('#pickup, #pickupDay').on('mouseover', function(){
      $(this).css('background-color', '#aad0ae')
      $('.pickup-icon').attr('src', '/images/pickup-icon-active.png')
      $(this).find('.modal-footing').css('color', 'white')
    })
    $('#pickup, #pickupDay').on('mouseout', function(){
      $(this).css('background-color', 'white')
      $('.pickup-icon').attr('src', '/images/pickup-icon-inactive.png')
      $(this).find('.modal-footing').css('color', '#363636')
    })

    $('#delivery, #deliveryDay').on('mouseover', function(){
      $(this).css('background-color', '#aad0ae')
      $('.delivery-icon').attr('src', '/images/delivery-icon-active.png')
      $(this).find('.modal-footing').css('color', 'white')
    })
    $('#delivery, #deliveryDay').on('mouseout', function(){
      $(this).css('background-color', 'white')
      $('.delivery-icon').attr('src', '/images/delivery-icon-inactive.png')
      $(this).find('.modal-footing').css('color', '#363636')
    })


    $(document).on('click', '.checkout-button', function(){
      localStorage.checkoutInitiated = 1
      nextAvalFulfill()
      if (localStorage.myStore) {
        var storeName = JSON.parse(localStorage.myStore)
        console.log(storeName)
        $('.store-desc').html(storeName.name)
      }

      if (!localStorage.fulfillment_method) {
        $('#modal-initial-click').addClass('is-active')
      }
    })

    $(document).on('click', '#deliveryRadio', function(){
      $('a#pickupRadio').removeClass('active')
      $('a#deliveryRadio').addClass('active')
      localStorage.fulfillment_method = 'delivery'
      console.log('deliver')
    })

    $(document).on('click', '#pickupDay', function(){ // Store users pickup day preference and move on.
      var date = $(this).find('.pickup-date').data()
      localStorage.pickup_day = date.date
      $('.modal').removeClass('is-active')
      $('#modal-checkout').addClass('is-active')
        if (localStorage.myStore) {
          var store = JSON.parse(localStorage.pickupLocation)
          var day = localStorage.pickup_day
          day = moment(day).format('dddd MMMM DD')
          $('#checkout-fulfillment').html('Your order will be ready for pickup<br /><strong>' + day +'</strong><br />At<br /><strong>'+ store.desc+'<br />'+ store.address +'</strong>')
        }
    }) 

    function nextAvalFulfill() { // Simple function to find the next available fulfillment date based on today's date.
      var wednesday
      var monday 
      var day = moment().format('dddd')
      var dayTwo = moment().format('dddd')

      if (day == 'Monday' || day == 'Tuesday') { // If we are still prior to cut off date, allow fulfillment this week
        var wednesday = moment().add(0, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD YYYY')
      } else {// We have passed the cut off for this week, need to schedule for next week.
        var wednesday = moment().add(1, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD YYYY')
      }
      
      if (dayTwo == 'Friday' || day == 'Saturday' || day == 'Sunday' || day == 'Monday') {
        var monday = moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')    
      } else {
        var monday = moment().add(0, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
      }
      var result = {
        monday: monday,
        wednesday: wednesday
      }

      var pickupDayModal = $('#pickupDaysList')
      var thisMon = moment(monday).format('MMM DD')
      var nextMon = moment(monday).add(1, 'week').format('MMM DD')
      var thisWed = moment(wednesday).format('MMM DD')
      var nextWed = moment(wednesday).add(1, 'week').format('MMM DD')
      pickupDayModal.html('')
      pickupDayModal.append('<div class="listing-item"><div class="list-item"><span-class="is-pulled-left">Monday<span><span class="store-hours is-pulled-right">'+thisMon+'</span></div></div>')
      pickupDayModal.append('<div class="listing-item"><div class="list-item">Wednesday<span class="store-hours is-pulled-right">'+thisWed+'</span></div></div>')
      pickupDayModal.append('<div class="listing-item"><div class="list-item">Monday<span class="store-hours is-pulled-right">'+nextMon+'</span></div></div>')
      pickupDayModal.append('<div class="listing-item"><div class="list-item">Wednesday<span class="store-hours is-pulled-right">'+nextWed+'</span></div></div>')


      
      $('#pickup-monday').attr('data-date', moment(monday).format('MM-DD-YYYY'))
      $('#pickup-monday').html(moment(monday).format('dddd MMMM DD'))
      $('#pickup-wednesday').attr('data-date', moment(wednesday).format('MM-DD-YYYY'))
      $('#pickup-wednesday').html(moment(wednesday).format('dddd MMMM DD'))

    }

    $(document).find('.categories > a').on('click', function(){
      $("#item-container > li.flex-item[data-category!='"+this.className+"']").toggle()
    })

    $('#create-account').on('click', function(){
      $('#modal-checkout-account').addClass('is-active')

      $('#modal-checkout').removeClass('is-active').slideDown()

    })
    $('.checkout-form-row > a').on('click', function() {
      $('.checkout-form-row > a').removeClass('checked')
      $(this).addClass('checked')
      if (this.id == 'stripe-checkout') {
        $('.paypal-checkout').addClass('hidden').fadeOut()
        $('.stripe-checkout').removeClass('hidden').fadeIn()
      } else {
        $('div#zoid-paypal-button-7a03492904').click()
      }
    })

(function() {
var cart = $('#cart')
  if (window.innerWidth < 1100) {
    cart.css('display', 'none')
    $('.flex-container').css('width','100%')
  } else {
    cart.css('display', 'flex')
    $('.flex-container').css('width','70%')

  }
})();

window.addEventListener("resize", function(){
var cart = $('#cart')
  if (window.innerWidth < 1100) {
    cart.css('display', 'none')
    $('.flex-container').css('width','100%')
  } else {
    cart.css('display', 'flex')
    $('.flex-container').css('width','70%')

  }
})

$('#burger').on('click', function(){
var cart = $('#cart')

cart.css('display', 'flex')
$('.flex-container').css('width','70%')
})