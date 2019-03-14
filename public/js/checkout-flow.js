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
      
      console.log(typeof monday)

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
        console.log('store',storeName)
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

        }
        updateCartDiv()

      })

      if (localStorage.fulfillment_method == 'pickup') {
        $('#info-billing').hide()
        $('#copyBillingAddr').hide()
        $('#pickup-label').html(JSON.parse(localStorage.pickupLocation).desc)

      }


    
    $(document).ready(function(){
      $('.shipping-form').hide()


        if(localStorage.fulfillment_method == 'pickup') {
            var store = JSON.parse(localStorage.pickupLocation)

        }

        updateCartDiv()

      $('#info-billing').hide()
    //   $('#paypal-button-container').hide()
      if (localStorage.fulfillment_method == 'pickup') {
        $('a#pickupRadio').addClass()
        $('#fulfillment-options').html('Pickup Info')


      }
    })
    $('#same-address').on('click', function(){$('.shipping-form').toggle()})
    // $('.same-address').on('click', function(){
      
    //     $('#state-ship').val($('#state-bill').val())
    //     $('input[name="street-ship"]').val($('input[name="street-bill"]').val())
    //     // $('input[name="street2-ship"]').val($('input[name="street2-bill"]'),val())
    //     $('input[name="city-ship"]').val($('input[name="city-bill"]').val())
    //     // $('input[name="state-ship"]').val($('input[name="state-bill"]').val())
    //     $('input[name="zip-ship"]').val($('input[name="zip-bill"]').val())




    // })

    $('#createToken').on('click', function(){
      stripe.createToken(card).then(function (result) {
        console.log('done')
        $('input[name=stripeToken]').val(result.token.id)

        var billing = {
          street: $('input[name="street-bill"]').val(),
          street_2: $('input[name="street2-bill"]').val(),
          city: $('input[name="city-bill"]').val(),
          state: $('input[name="state-bill"]').val(),
          zip: $('input[name="zip-bill"]').val(),
          coupon: $('input[name="promoCode"]').val(),
          stripeToken: result.token.id,
          shippingCode: localStorage.shippingCode
        }
      
      var shipping = {
          street: $('input[name="street-ship"]').val(),
          city: $('input[name="city-ship"]').val(),
          state: $('input[name="state-ship"]').val(),
          zip: $('input[name="zip-ship"]').val()
      }
      var user = {
          firstName: $('input[id="firstName"]').val(),
          lastName: $('input[id="lastName"]').val(),
          email: $('input[id="email-bill"]').val(),
          phone: $('input[id="phone"]').val(),
          password: $('input[id="password-bill"').val(),
          fulfillment_method: localStorage.fulfillment_method,
          fulfillment_day: localStorage.fulfillment_day,
          pickup_location: localStorage.pickupLocation
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

          },
          failure: function(errMsg) {
            // return alert(JSON.stringify(errMsg));
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
    success: function(data){
      var total = $('.order-total').data('total')
      if (data.amount_off) {
        toastr['success']('Coupon for $' + (data.amount_off / 100) + ' successfully applied')
        total = total - (data.amount_off / 100)
        console.log(data.amount_off / 100) 
        $('.order-total').html(total.toFixed(2))
        disableCoupon()
      }
      if (data.percent_off) {
        toastr['success']('Coupon for ' + data.percent_off + '% successfully applied')
        var percent = (data.percent_off / 100)
        var discount = (percent * total)
        console.log(total, discount)
        total = total - discount
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