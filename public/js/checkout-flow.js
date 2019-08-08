$('input[name=zip-bill]').on('change', calcShipping())

$('#info-billing > a').on('click', function () {
  $('input[name="street-ship"]').val($('input[name="street-bill"]').val())
  $('input[name="city-ship"]').val($('input[name="city-bill"]').val())
  $('input[name="state-ship"]').val($('input[name="state-bill"]').val())
  $('input[name="zip-ship"]').val($('input[name="zip-bill"]').val())
})

$('.shipping-form :input').on('change', function () {
  $('#shippingDetails').css('display', 'block')
  $('#shippingDetails').html('')
  $('#shippingDetails').append('<li>' + $('input[name=name-ship]').val() + '</li>')
  $('#shippingDetails').append('<li>' + $('input[name=street-ship]').val() ? $('input[name=street-ship]').val() : +'</li>')
  $('#shippingDetails').append('<li>' + $('input[name=city-ship]').val() ? $('input[name=city-ship]').val() : +'</li>')
  $('#shippingDetails').append('<li>' + $('input[name=state-ship]').val() ? $('input[name=state-ship]').val() : +'</li>')
})

function nextAvalFulfill() { // Simple function to find the next available fulfillment date based on today's date.
  let thursday
  let monday

  monday = moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
  thursday = moment().add(1, 'weeks').startOf('isoweek').add(3, 'days').format('dddd MMMM DD YYYY')
  switch (moment().format('dddd')) {
    case 'Monday':
      thursday = moment().add(0, 'weeks').startOf('isoweek').add(3, 'days').format('dddd MMMM DD YYYY')
      break;
    case 'Tuesday':
      thursday = moment().add(0, 'weeks').startOf('isoweek').add(3, 'days').format('dddd MMMM DD YYYY')
      break;
  }

  if (moment().format('dddd') == 'Friday') {
    let format = 'HH:mm:ss'
    let t = moment().format(format)
    let time = moment(t, format)
    beforeTime = moment('00:00:00', format),
      afterTime = moment('08:00:00', format);

    if (time.isBetween(beforeTime, afterTime)) {
      monday = moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
    } else {
      monday = moment().add(2, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
    }
  }
  if (moment().format('dddd') == 'Saturday' || moment().format('dddd') == 'Sunday') {
    monday = moment().add(2, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')

  }


  var result = {
    monday: monday,
    thursday: thursday
  }

  var pickupDaysModal = $('#pickupDaysList')


  var thisMon = moment(monday, 'dddd MMMM DD YYYY').format('dddd MMM DD')
  var nextMon = moment(monday, 'dddd MMMM DD YYYY').add(1, 'week').format('dddd MMM DD')
  var thisThurs = moment(thursday, 'dddd MMMM DD YYYY').format('dddd MMM DD')
  var nextThurs = moment(thursday, 'dddd MMMM DD YYYY').add(1, 'week').format('dddd MMM DD')

  let dates = [thisMon, nextMon, thisThurs, nextThurs]
  let _sortedDates = dates.sort(function (a, b) {
    return moment(a).format('X') - moment(b).format('X')
  })

  pickupDaysModal.html('<ul class="list-group">')

  for (var i = 0; i < _sortedDates.length; i++) {
    let dayObj = _sortedDates[i].split(' ')
    let day = dayObj[0]
    let date = dayObj[1] + ' ' + dayObj[2]
    if (localStorage.fulfillment_date === date || i === 0) {
      var isActive = 'active'
    } else {
      var isActive = null
    }
    pickupDaysModal.append('<li class="list-group-item clickable '+isActive+'" data-day="'+day+'" data-date="'+date+'"><div class="row"><div class="col date-list-item">'+day+'</div><div class="col store-hours is-pulled-right">'+date+'</div></div></div></li>')
  }

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


}
localStorage.checkoutInitiated = 1
nextAvalFulfill()
if (localStorage.myStore) {
  let storeName = JSON.parse(localStorage.myStore)
  $('.store-desc').html('<strong>Pickup Location</strong><br />' + storeName.name)
}


if (!localStorage.fulfillment_method) {
  $('#modal-initial-click').addClass('is-active')
}
$('.time-slot-am').on("click", function () {
  localStorage.deliveryWindow = 'am'
  toastr["success"]("Delivery window set for AM")

});
$('.time-slot-pm').on("click", function () {
  localStorage.deliveryWindow = 'pm'
  toastr["success"]("Delivery window set for PM")

});

$('#pickupDaysList > .list-group-item.clickable').on('click', function () {

  let data = $(this).data()
  localStorage.fulfillment_day = data.day
  localStorage.fulfillment_date = data.date

  $('#pickupDaysList > .list-group-item').removeClass('active')
  $(this).addClass('active')
  if (localStorage.pickupLocation) {
    let store = JSON.parse(localStorage.pickupLocation)
    if (localStorage.fulfillment_method == 'pickup') {
      $('#info-billing').hide()
      $('#copyBillingAddr').hide()
      $('#pickup-label').html(JSON.parse(localStorage.pickupLocation).desc)

    }
  }
  updateCartDiv()

})


$(document).ready(function () {


  card.addEventListener('change', function (event) {
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





$('#password_confirmation').on('focusout', function () {
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



$('#addCardToCust').on('click', function () {
  $(this).html('Processing order... <div id="loading"></div>')
  $(this).attr('disabled', 'disabled')
  var source = $('.billing-source').find('input[type=radio]:checked').val()
  if (source === 'addCard') {
    stripe.createToken(card).then(function (result) {
      processOrder({ type: 'new' }, result.token.id)
    })
  } else {
    processOrder({ type: 'existing' }, source)
  }

})

function processOrder(card, id) {

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
    deliveryWindow: $('.deliveryWindow').find('.active').find('input').attr('id'),
    tax: $('.order-tax').html(),
    shipping: $('.order-shipping').html()


  }

  var shipping = {
    recipient: $('input[name="name-ship"]').val() ? $('input[name="name-ship"]').val() : $('input[id="email-bill"]').val(),
    street: $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val(),
    city: $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val(),
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
    data: JSON.stringify({ data: obj }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      localStorage.cart = []

      if (data.status == 'success') {
        window.location.href = '/checkout/confirmation'
      } else {
        $('#addCartToCust').html('Waiting for order confirmation')
      }

    },
    failure: function (errMsg) {
      toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
    }
  })
}


$('document').on('click', '#createToken', function () {
  
  $(this).html('Processing order... <div id="loading"></div>')
  $(this).attr('disabled', 'disabled')

  let iframe = document.getElementById("hidden-mailchimp");
  let email = iframe.contentWindow.document.getElementById('mce-EMAIL')
  let fname = iframe.contentWindow.document.getElementById('mce-FNAME')
  let lname = iframe.contentWindow.document.getElementById('mce-LNAME')

  email.value = document.getElementById('email-bill').value
  fname.value = document.getElementById('firstName').value
  lname.value = document.getElementById('lastName').value
  let form = iframe.contentWindow.document.getElementById('mc-embedded-subscribe-form')
  form.submit()


  stripe.createToken(card).then(function (result) {

    let billing = {
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

    let shipping = {
      recipient: $('input[name="name-ship"]').val() ? $('input[name="name-ship"]').val() : $('input[id="email-bill"]').val(),
      street: $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val(),
      city: $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val(),
      state: $('select#state-ship').val() ? $('select#state-ship').val() : $('select#state-bill').val(),
      zip: $('input[name="zip-ship"]').val() ? $('input[name="zip-ship"]').val() : $('input[name="zip-bill"]').val()
    }

    let user = {
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

    let cart = localStorage.cart
    let obj = {
      billing,
      shipping,
      user,
      cart
    }
    $.ajax({
      type: 'POST',
      url: '/checkout/stripe',
      data: JSON.stringify({ data: obj }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        localStorage.cart = []

        if (data.status == 'success') {
          window.location.href = '/checkout/confirmation'
        } else {
          $('#toggleSections').html('Waiting for order confirmation')
          $('#addCardToCust').html('Waiting for order confirmation')
        }

      },
      failure: function (errMsg) {
        toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
      }
    })
  })

})

$('#applyCoupon').on('click', function () {
  var coupon = $('input[name="promoCode"]').val()
  $.ajax({
    type: 'GET',
    url: '/checkout/coupon/apply/' + coupon,
    error: function (err) {
      toastr['warning']('Sorry this coupon appears to be invalid')
    },
    success: function (data) {
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

$('#alternate-address').on('click', function () {
  $('#billing-info').removeClass('hidden')
})

$('input[type=radio]').on('change', function () {
  var val = $(this).val()
  if (val == 'addCard') {
    $('.addCardForm').removeClass('hidden').fadeIn()
  } else {

    $('.addCardForm').addClass('hidden').fadeOut()
  }
})



function anything() {


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
      deliveryWindow: $('.deliveryWindow').find('.active').find('input').attr('id'),
      tax: $('.order-tax').html(),
      shipping: $('.order-shipping').html()

    }

    var shipping = {
      recipient: $('input[name="name-ship"]').val() ? $('input[name="name-ship"]').val() : $('input[id="email-bill"]').val(),
      street: $('input[name="street-ship"]').val() ? $('input[name="street-ship"]').val() : $('input[name="street-bill"]').val(),
      city: $('input[name="city-ship"]').val() ? $('input[name="city-ship"]').val() : $('input[name="city-bill"]').val(),
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
      data: JSON.stringify({ data: obj }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        localStorage.cart = []
        window.location.href = '/checkout/confirmation'

      },
      failure: function (errMsg) {
        toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
      }
    })
  })

}

if (localStorage.fulfillment_method === 'delivery') {
  $('#shippingDetails').show()
}

$('li.list-group-item.clickable').on('click', function(){
  let def = $('li.list-group-item.clickable.active').data()
  localStorage.fulfillment_day = def.day
  localStorage.fulfillment_date = def.date
  $.ajax({
    type: 'POST',
    url: '/account/fulfill/day/update',
    data: {fulfillment_day: def.day},
    success: console.log('Options updated')
  })
})

$('#pickupRadio').on('click', function(){
  $('#shippingDetails').hide()
})