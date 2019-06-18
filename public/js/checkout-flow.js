$('#info-billing > a').on('click', function(){
  $('input[name="street-ship"]').val($('input[name="street-bill"]').val())
  $('input[name="city-ship"]').val($('input[name="city-bill"]').val())
  $('input[name="state-ship"]').val($('input[name="state-bill"]').val())
  $('input[name="zip-ship"]').val($('input[name="zip-bill"]').val())
}) 

$('#paypal-checkout').on('click', function(){
$('.modal').modal('hide')
$('#card-element').hide()
$('#info-basic').hide()
$('#stripe-checkout').removeClass('active')
$(this).addClass('active')
})

$('#stripe-checkout').on('click', function(){
$('.modal').removeClass('is-active')
$('#info-basic').show()

$('#paypal-checkout').removeClass('active')
$(this).addClass('active')
$('#card-element').show()
$('#paypal-button-container').hide()
$('#checkout-options').html('<a id="createToken" class="button is-everyday">Checkout</a>')
})

$('.shipping-form :input').on('change', function(){
  $('#shippingDetails').css('display', 'block')
  $('#shippingDetails').html('')
  $('#shippingDetails').append('<li>' + $('input[name=name-ship]').val()+'</li>')
  $('#shippingDetails').append('<li>' + $('input[name=street-ship]').val() ? $('input[name=street-ship]').val() : +'</li>')
  $('#shippingDetails').append('<li>' + $('input[name=city-ship]').val() ? $('input[name=city-ship]').val() : +'</li>')
  $('#shippingDetails').append('<li>' + $('input[name=state-ship]').val() ? $('input[name=state-ship]').val() : +'</li>')
})

function nextAvalFulfill() { // Simple function to find the next available fulfillment date based on today's date.
var wednesday
var monday 
console.log(moment().format('HH:mm'))

var monday = moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
var wednesday = moment().add(1, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD YYYY')
switch(moment().format('dddd')) {
  case 'Monday':
  var wednesday = moment().add(0, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD YYYY')
  break;

  case 'Tuesday':
  var wednesday = moment().add(0, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD YYYY')
  break;
}

if (moment().format('dddd') == 'Friday') { 
  var format = 'HH:mm:ss'

  var t = moment().format(format)
  var time = moment(t, format)
    beforeTime = moment('00:00:00', format),
    afterTime = moment('08:00:00', format);
  
  if (time.isBetween(beforeTime, afterTime)) {
  
    var monday = moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
    console.log('is between')
  } else {
    console.log('is not between')
    console.log(typeof time, typeof beforeTime, typeof afterTime, typeof t)
    var monday = moment().add(2, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
  
  }
}


    var result = {
      monday: monday,
      wednesday: wednesday
    }

    var pickupDaysModal = $('#pickupDaysList')
    

    var thisMon = moment(monday, 'dddd MMMM DD YYYY').format('MMM DD')
    var nextMon = moment(monday, 'dddd MMMM DD YYYY').add(1, 'week').format('MMM DD')
    var thisWed = moment(wednesday, 'dddd MMMM DD YYYY').format('MMM DD')
    var nextWed = moment(wednesday, 'dddd MMMM DD YYYY').add(1, 'week').format('MMM DD')
    
    var dates = [thisMon, nextMon, thisWed, nextWed]
    let _sortedDates = dates.sort(function(a, b){
      return moment(a).format('X')-moment(b).format('X')
    });
    console.log(_sortedDates)
    pickupDaysModal.html('<ul class="list-group">')


    pickupDaysModal.append('<li class="list-group-item clickable active" data-day="monday" data-date="'+thisMon+'"><div class="row"><div class="col date-list-item">Monday</div><div class="col store-hours is-pulled-right">'+thisMon+'</div></div></div></li>')
    pickupDaysModal.append('<li class="list-group-item clickable" data-day="wednesday" data-date="'+thisWed+'" ><div class="row"><div class="col date-list-item">Wednesday</div><div class="col store-hours is-pulled-right">'+thisWed+'</div></div></div></li>')
    pickupDaysModal.append('<li class="list-group-item clickable" data-day="monday" data-date="'+nextMon+'"><div class="row"><div class="col date-list-item" >Monday</div><div class="col store-hours is-pulled-right">'+nextMon+'</div></div></div></li>')
    pickupDaysModal.append('<li class="list-group-item clickable" data-day="wednesday" data-date="'+nextWed+'"><div class="row"><div class="col date-list-item">Wednesday</div><div class="col store-hours is-pulled-right">'+nextWed+'</div></div></div></li>')
    pickupDaysModal.append('<li class="list-group-item button-group"><h4 class="mb-3 d-flex justify-content-center">Pick a time</h4>\
    <div class="btn-group btn-group-toggle deliveryWindow" data-toggle="buttons">\
        <label class="btn btn-secondary btn-lg active time-slot-am">\
          <input type="radio" name="time-slot-am" id="am" autocomplete="off" checked> AM\
        </label>\
        <label class="btn btn-secondary btn-lg time-slot-pm">\
          <input type="radio" name="time-slot-pm" id="pm" autocomplete="off"> PM\
        </label>\
      </div></li>')
    pickupDaysModal.append('</ul>')


    
    $('#pickup-monday').attr('data-date', moment(monday).format('MM-DD-YYYY'))
    $('#pickup-monday').html(moment(monday).format('dddd MMMM DD'))
    $('#pickup-wednesday').attr('data-date', moment(wednesday).format('MM-DD-YYYY'))
    $('#pickup-wednesday').html(moment(wednesday).format('dddd MMMM DD'))
    var def = $('li.list-group-item.clickable.active').data()
    localStorage.fulfillment_day = def.day 
    localStorage.fulfillment_date = def.date
  }
    localStorage.checkoutInitiated = 1
    nextAvalFulfill()
    if (localStorage.myStore) {
      var storeName = JSON.parse(localStorage.myStore)
      $('.store-desc').html('<strong>Pickup Location</strong><br />' + storeName.name)
    }


    if (!localStorage.fulfillment_method) {
      $('#modal-initial-click').addClass('is-active')
    }
    $('.time-slot-am').on("click",function(){ 
      localStorage.deliveryWindow = 'am'
      toastr["success"]("Delivery window set for AM")

   });
   $('.time-slot-pm').on("click",function(){ 
      localStorage.deliveryWindow = 'pm'
      toastr["success"]("Delivery window set for PM")

   });

    $('#pickupDaysList > .list-group-item.clickable').on('click', function(){

      var data = $(this).data()
      localStorage.fulfillment_day = data.day
      localStorage.fulfillment_date = data.date

      $('#pickupDaysList > .list-group-item').removeClass('active')
      $(this).addClass('active')
      if (localStorage.pickupLocation) {
        var store = JSON.parse(localStorage.pickupLocation)
        if (localStorage.fulfillment_method == 'pickup') {
          $('#info-billing').hide()
          $('#copyBillingAddr').hide()
          $('#pickup-label').html(JSON.parse(localStorage.pickupLocation).desc)
  
        }
      }
      updateCartDiv()

    })




  
  $(document).ready(function(){

    card.addEventListener('change', function(event) {
      console.log(JSON.stringify(event))
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
        $('#toggleSections').attr('disabled', 'disabled')
      } else {
        if (event.complete) {
          $('#toggleSections').removeAttr('disabled')
        } else {
          $('#toggleSections').attr('disabled', 'disabled')

        }
        displayError.textContent = '';
      }
    });

    $('.shipping-form').closest('.card').hide()
    //Hide the next button on Desktop 
    $('.checkout-button').addClass('d-md-none d-lg-none')

      updateCartDiv()

    $('#info-billing').hide()

  })





  $('#password_confirmation').on('focusout', function(){
    var pass = $('#password-bill').val()
    var confirm = $(this).val()

    if (pass != confirm) {
      $('.invalid-password-feedback').html('<p style="color:red;font-weight:500;text-align:center;">Sorry the passwords do not match.  Try again</p>')
      $('#main :input, #createToken').attr('disabled', 'disabled')
    } else {
      $('.invalid-password-feedback').html('')
      $('#main :input, #createToken').removeAttr('disabled')
    }
  })

  

  $('#addCardToCust').on('click', function(){
    $(this).html('Processing order... <div id="loading"></div>')
    $(this).attr('disabled', 'disabled')
    var source = $('.billing-source').find('input[type=radio]:checked').val()
    console.log('source')
    if (source === 'addCard') {
      stripe.createToken(card).then(function (result) {
        processOrder({type: 'new'}, result.token.id)
      })
    } else {
      processOrder({type: 'existing'}, source )
    }

  })

  function processOrder(card, id){

    var billing = {
      street: $('input[name="street-bill"]').val(),
      street_2: $('input[name="street2-bill"]').val(),
      city: $('input[name="city-bill"]').val(),
      state: $('select#state-bill').val(),
      zip: $('input[name="zip-bill"]').val(),
      coupon: $('input[name="promoCode"]').val(),
      shippingCode: localStorage.shippingCode,
      allergy_info: $('input[name=allergy_info]').val(),
      delivery_info: $('input[name=delivery_notes]').val(),
      type: card.type,
      paymentId: id,

    }
  
    var shipping = {
        recipient: $('input[name="name-ship"]').val() ? $('input[name="name-ship"]').val() : $('input[id="email-bill"]').val(),
        street: $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val(),
        city: $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val() ,
        state: $('select#state-ship').val() ? $('select#state-ship').val() : $('select#state-bill').val(),
        zip: $('input[name="zip-ship"]').val() ? $('input[name="zip-ship"]').val() : $('input[name="zip-bill"]').val()
    }
    
    var user = {
        firstName: $('input[id="firstName"]').val(),
        lastName: $('input[id="lastName"]').val(),
        email: $('input[id="email-bill"]').val(),
        phone: $('input[id="phone"]').val(),
        password: $('#password-bill').val(),
        fulfillment_method: localStorage.fulfillment_method,
        fulfillment_day: $('li.list-group-item.clickable.active').data('day'),
        fulfillment_date: $('li.list-group-item.clickable.active').data('date'),
        pickup_location: localStorage.myStore
    }
    var cart = localStorage.cart
    var obj = {
        billing,
        shipping,
        user,
        cart
    }

    $.ajax({
      type: 'POST',
      url: '/checkout/express',
      data: JSON.stringify({data:obj}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        localStorage.cart = []

        window.location.href = '/checkout/confirmation'
      },
      failure: function(errMsg) {
        toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
      }
  })
  }
  

  $('document').on('click', '#createToken', function(){
    $(this).html('Processing order... <div id="loading"></div>')
    $(this).attr('disabled', 'disabled')

    var iframe = document.getElementById("hidden-mailchimp");
    var email = iframe.contentWindow.document.getElementById('mce-EMAIL')
    var fname = iframe.contentWindow.document.getElementById('mce-FNAME')
    var lname = iframe.contentWindow.document.getElementById('mce-LNAME')

    email.value = document.getElementById('email-bill').value
    fname.value = document.getElementById('firstName').value
    lname.value = document.getElementById('lastName').value
    var form = iframe.contentWindow.document.getElementById('mc-embedded-subscribe-form')
    form.submit()


    stripe.createToken(card).then(function (result) {

      var billing = {
        street: $('input[name="street-bill"]').val(),
        street_2: $('input[name="street2-bill"]').val(),
        city: $('input[name="city-bill"]').val(),
        state: $('select#state-bill').val(),
        zip: $('input[name="zip-bill"]').val(),
        coupon: $('input[name="promoCode"]').val(),
        allergy_info: $('input[name=allergy_info]').val(),
        delivery_info: $('input[name=delivery_notes]').val(),
        stripeToken: result.token.id,
        shippingCode: localStorage.shippingCode,
          }
    
    var shipping = {
        recipient: $('input[name="name-ship"]').val() ? $('input[name="name-ship"]').val() : $('input[id="email-bill"]').val(),
        street: $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val(),
        city: $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val() ,
        state: $('select#state-ship').val() ? $('select#state-ship').val() : $('select#state-bill').val(),
        zip: $('input[name="zip-ship"]').val() ? $('input[name="zip-ship"]').val() : $('input[name="zip-bill"]').val()
    }
    
    var user = {
        firstName: $('input[id="firstName"]').val(),
        lastName: $('input[id="lastName"]').val(),
        email: $('input[id="email-bill"]').val(),
        phone: $('input[id="phone"]').val(),
        password: $('#password-bill').val(),
        fulfillment_method: localStorage.fulfillment_method,
        fulfillment_day: localStorage.fulfillment_day,
        fulfillment_date: localStorage.fulfillment_date,
        pickup_location: localStorage.myStore
    }

    if ($('input[name="subscribe"]').is(':checked')) {
      user.subscribe = true
    } else {
      user.subscribe = false
    }

    var cart = localStorage.cart
    var obj = {
        billing,
        shipping,
        user,
        cart
    }
    $.ajax({
        type: 'POST',
        url: '/checkout/stripe',
        data: JSON.stringify({data:obj}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
          localStorage.cart = []
          updateCartDiv()
          window.location.href = '/checkout/confirmation'

        },
        failure: function(errMsg) {
          toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
        }
    })
    })

  })

$('#applyCoupon').on('click', function(){
var coupon = $('input[name="promoCode"]').val()
$.ajax({
  type: 'GET',
  url: '/checkout/coupon/apply/' + coupon,
  error: function(err) {
    toastr['warning']('Sorry this coupon appears to be invalid')
  },
  success: function(data){
    var total = $('.order-total').html()
    if (data.amount_off) {
      toastr['success']('Coupon for $' + (data.amount_off / 100) + ' successfully applied')
      total = total - (data.amount_off / 100)
      total = total.toFixed(2)
      $('.order-total').data('total', total)
      $('.order-total').html(total)
      disableCoupon()
    }
    if (data.percent_off) {
      toastr['success']('Coupon for ' + data.percent_off + '% successfully applied')
      var percent = (data.percent_off / 100)
      var discount = (percent * total)
      total = total - discount
      // Applying a promo code needs to affect the order total data attribute but not shipping.
      $('.order-total').data('total', total.toFixed(2))

      $('.order-total').html(total.toFixed(2))
      disableCoupon()
    }
  }
})
})

function disableCoupon() {
$('input[name="promoCode"]').attr('disabled', 'disabled')
$('#applyCoupon').attr('disabled', 'disabled')

}

$('#alternate-address').on('click',function(){
$('#billing-info').removeClass('hidden')
})

$('input[type=radio]').on('change',function(){
var val = $(this).val()
if (val == 'addCard') {
  $('.addCardForm').removeClass('hidden').fadeIn()
} else {
  
  $('.addCardForm').addClass('hidden').fadeOut()
}
})

/**
* 
* Function to calculate shipping charges based on zip code
*/

function calcShipping(){
var store = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-85.317172,35.069111]
  }
}



if (localStorage.userAddr) {
  $('#address-input').text(localStorage.userAddr.street)
}

// If only billing zip is entered then use this for delivery fee calculation.  Else, use the shipping zip.
var st = $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val()
var city = $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val()
var state = $('input[name="state-ship"]').val() ? $('input[name="state-ship"]').val() : $('input[name="state-bill"]').val()
var post = $('input[name="zip-ship"]').val() ? $('input[name="zip-ship"]').val() : $('input[name="zip-bill"]').val()


var search = encodeURI(st + ' ' + city + ' ' + state + ' ' + post)

var userAddr = {
  street: st,
  city: city,
  state: state,
  zip: post
}
localStorage.userAddr = JSON.stringify(userAddr)
var userSearch = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+search+".json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1548866594131&autocomplete=true"
$.get(userSearch, function(data) {
  var userCords = data.features[0].geometry.coordinates
  var query = "https://api.mapbox.com/directions/v5/mapbox/driving/"+encodeURI(store.geometry.coordinates)+"%3B"+encodeURI(userCords)+".json?access_token=pk.eyJ1IjoiZW54byIsImEiOiJjanI5Nnc5aTUwZWo2NDlud2F6MnJwZ3A5In0.WhklmDXw40rTZ2OwDGS2LA"
  $.get(query, function(distance) {
    var miles = distance.routes[0].distance*0.000621371192
    var total = $('.order-total').data('total')

    if (total >= 100) {
      localStorage.shippingCode = 'freeshipping'
    } else {
      if (miles.toFixed(0) > 5 && localStorage.fulfillment_method != 'pickup') {
      if (miles.toFixed(0) <= 10) {
        localStorage.shippingCode = '5to10miles'
        total += 5
        $('.order-total').html(total)
        $('.order-shipping').html('5.00')
      }
      if (miles.toFixed(0) > 10) {
        var total = $('.order-total').data('total')
        total += 10
        $('.order-total').html(total)
        localStorage.shippingCode = '11to15miles'
        $('.order-shipping').html('10.00')

      }
      
      toastr['error']('Sorry this address is outside of our delivery zone.  You are ' + miles.toFixed(0) + ' miles from our nearest store.')
    } else if (miles.toFixed(0) < 5) {
      localStorage.shippingCode = 'freeshipping'
      $('.order-shipping').html('0')
      toastr['success']('You"re all set!')
      }
    }

    localStorage.deliveryDistance = miles.toFixed(1)
  })
})
}

function anything(){

  var iframe = document.getElementById("hidden-mailchimp");
  var email = iframe.contentWindow.document.getElementById('mce-EMAIL')
  var fname = iframe.contentWindow.document.getElementById('mce-FNAME')
  var lname = iframe.contentWindow.document.getElementById('mce-LNAME')

  email.value = document.getElementById('email-bill').value
  fname.value = document.getElementById('firstName').value
  lname.value = document.getElementById('lastName').value
  var form = iframe.contentWindow.document.getElementById('mc-embedded-subscribe-form')
  form.submit()
  $('#toggleSections').html('Processing order... <div id="loading"></div>')
  $('#toggleSections').attr('disabled', 'disabled')

  stripe.createToken(card).then(function (result) {

    var billing = {
      street: $('input[name="street-bill"]').val(),
      street_2: $('input[name="street2-bill"]').val(),
      city: $('input[name="city-bill"]').val(),
      state: $('select#state-bill').val(),
      zip: $('input[name="zip-bill"]').val(),
      coupon: $('input[name="promoCode"]').val(),
      allergy_info: $('input[name=allergy_info]').val(),
      delivery_info: $('input[name=delivery_notes]').val(),
      stripeToken: result.token.id,
      shippingCode: localStorage.shippingCode,
    }
  
  var shipping = {
      recipient: $('input[name="name-ship"]').val() ? $('input[name="name-ship"]').val() : $('input[id="email-bill"]').val(),
      street: $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val(),
      city: $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val() ,
      state: $('select#state-ship').val() ? $('select#state-ship').val() : $('select#state-bill').val(),
      zip: $('input[name="zip-ship"]').val() ? $('input[name="zip-ship"]').val() : $('input[name="zip-bill"]').val()
  }
  
  var user = {
      firstName: $('input[id="firstName"]').val(),
      lastName: $('input[id="lastName"]').val(),
      email: $('input[id="email-bill"]').val(),
      phone: $('input[id="phone"]').val(),
      password: $('#password-bill').val(),
      fulfillment_method: localStorage.fulfillment_method,
      fulfillment_day: localStorage.fulfillment_day,
      fulfillment_date: localStorage.fulfillment_date,
      pickup_location: localStorage.myStore
  }

  if ($('input[name="subscribe"]').is(':checked')) {
    user.subscribe = true
  } else {
    user.subscribe = false
  }

  var cart = localStorage.cart
  var obj = {
      billing,
      shipping,
      user,
      cart
  }
  $.ajax({
      type: 'POST',
      url: '/checkout/stripe',
      data: JSON.stringify({data:obj}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        localStorage.cart = []
        window.location.href = '/checkout/confirmation'

      },
      failure: function(errMsg) {
        toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
      }
  })
  })

}