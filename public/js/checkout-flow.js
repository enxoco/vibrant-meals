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
      var monday = moment().add(0, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')    
    } else {
      var monday = moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD YYYY')
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
      
      pickupDaysModal.html('<ul class="list-group">')
  
      pickupDaysModal.append('<h4 class="mb-3 d-flex justify-content-center">Pick a day</h4>')
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
        $('.store-desc').html(storeName.name)
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

      $('.shipping-form').hide()
      //Hide the next button on Desktop 
      $('.checkout-button').addClass('d-md-none d-lg-none')

        if(localStorage.fulfillment_method == 'pickup') {
            var store = JSON.parse(localStorage.pickupLocation)

        }

        updateCartDiv()

      $('#info-billing').hide()
      if (localStorage.fulfillment_method == 'pickup') {
        $('a#pickupRadio').addClass()
        $('#fulfillment-options').html('Pickup Info')


      }
    })

    $('.express-checkout-default').on('click', function(){


        var billing = {
          street: $('input[name="street-bill"]').val(),
          street_2: $('input[name="street2-bill"]').val(),
          city: $('input[name="city-bill"]').val(),
          state: $('select#state-bill').val(),
          zip: $('input[name="zip-bill"]').val(),
          coupon: $('input[name="promoCode"]').val(),
          shippingCode: localStorage.shippingCode
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
        if (data.status == 'success') {
          toastr['success']('Order completed successfully')
          $('#orderConfirmation').modal('show')
          $('.express-checkout-default').html('<i data-feather="nc-check-2"></i> Payment Complete !')
          $('.express-checkout-default').attr('disabled', 'disabled')
          localStorage.cart = []
          updateCartDiv()
        } else {
          toastr['warning']('Something went wrong')
        }

      },
      failure: function(errMsg) {
        toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
      }
  })
    })

    // Simple custom form validation script to prevent user from going through
    // checkout process if they already have an account.
    $('#email-bill').on('keyup', function(){
      $.ajax({
        type: 'GET',
        url: '/api/user/check',
        data: {email: $(this).val()},
        success: function(res){
          if (res === "1") {
            $('.email-billing-feedback').html('<p style="color:red;font-weight:500;text-align:center;">Looks like we already have an account associated with this email. <a href="#" data-dismiss="modal" data-toggle="modal" data-target="#loginModal">Login</a> or <a href="#" data-toggle="modal" data-dismiss="modal" data-target="#passwordResetModal">Reset</a> your password to continue </p>')
            $('#main :input, #createToken').attr('disabled', 'disabled')
          } else {
            $('.email-billing-feedback').html('')
            $('#main :input, #createToken').removeAttr('disabled')
          }
        }
      })
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


    $('#createToken').on('click', function(){

      var iframe = document.getElementById("hidden-mailchimp");
      var email = iframe.contentWindow.document.getElementById('mce-EMAIL')
      var fname = iframe.contentWindow.document.getElementById('mce-FNAME')
      var lname = iframe.contentWindow.document.getElementById('mce-LNAME')

      email.value = document.getElementById('email-bill').value
      fname.value = document.getElementById('firstName').value
      lname.value = document.getElementById('lastName').value
      var form = iframe.contentWindow.document.getElementById('mc-embedded-subscribe-form')
      form.submit()

      $('#createToken').attr('disabled', 'disabled')

      stripe.createToken(card).then(function (result) {

        var billing = {
          street: $('input[name="street-bill"]').val(),
          street_2: $('input[name="street2-bill"]').val(),
          city: $('input[name="city-bill"]').val(),
          state: $('select#state-bill').val(),
          zip: $('input[name="zip-bill"]').val(),
          coupon: $('input[name="promoCode"]').val(),
          stripeToken: result.token.id,
          shippingCode: localStorage.shippingCode
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
            if (data.status == 'success') {
              $('#orderConfirmation').modal('show')
              $('.express-checkout-default').html('<i data-feather="nc-check-2"></i> Payment Complete !')
              $('.express-checkout-default').attr('disabled', 'disabled')
              localStorage.cart = []
              updateCartDiv()
            }
          },
          failure: function(errMsg) {
            toastr['warning']('Connection error.  Make sure you are connected to the internet and try again.')
          }
      })
      })

    })

    $('.checkout-paypal').on('click', function(){
        paypal.Buttons({
            style: {
              layout:  'horizontal',
              color:   'blue',
              shape:   'pill',
              label:   'pay',
              tagline: true
            },
            createOrder: function(data, actions) {
            // Set up the transaction
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: $('#total').val().split('$')[1]
                }
              }]
            })
          },
          onApprove: function(data, actions) {
            return actions.order.get().then(function (orderDetails) {

                $.ajax({

                })
               $.ajax({
                  type: "POST",
                  url: "/checkout/paypal",
                  // The key needs to match your method's input parameter (case-sensitive).
                  data: JSON.stringify({data:orderDetails}),
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function(data){
                    $('#paypal-button-container').hide()
                    $('#modal-paypal-confirmation').addClass('is-active')
                    $('.paypal-order-details').append(JSON.stringify(data))
                    // return alert(JSON.stringify(data))
                  },
                  failure: function(errMsg) {
                    // return alert(JSON.stringify(errMsg));
                  }
              });
            })
          }
        }).render('#paypal-button-container');
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
        $('.order-total').data('total', total)
        $('.order-total').html(total.toFixed(2))
        disableCoupon()
      }
      if (data.percent_off) {
        toastr['success']('Coupon for ' + data.percent_off + '% successfully applied')
        var percent = (data.percent_off / 100)
        var discount = (percent * total)
        total = total - discount
        // Applying a promo code needs to affect the order total data attribute but not shipping.
        $('.order-total').data('total', total)

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