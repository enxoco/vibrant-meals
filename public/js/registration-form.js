

// Create a Stripe client.

var stripe = Stripe("pk_test_RIU7I4O49GFzLUZHRafKTrtF");

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create("card", { style: style });

// Add an instance of the card Element into the card-element <div>.
card.mount("#card-element");

// Handle real-time validation errors from the card Element.
card.addEventListener("change", function(event) {
  var displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = "";
  }
});



// Create a token or display an error when the form is submitted.
var form = document.getElementById('checkout-form')
var button1 = document.getElementById('createToken')
$(document).on('click', '#createToken', function(){
  stripe.createToken(card).then(function (result) {
    console.log('done')
    $('input[name=stripeToken]').val(result.token.id)

    var $inputs = $('#info-basic :input, #info-billing :input');

  console.log('form')

  var values = {};
  $inputs.each(function() {
      values[this.name] = $(this).val();
  });
  var unCart = JSON.parse(localStorage.cart)
  var cart = []
  for (var i = 0; i < unCart.length; i++) {
    var c = {sku: unCart[i].sku, quantity: unCart[i].quantity}
    cart.push(c)
  }
  values.cart = cart
  values.stripeToken = result.token.id
  if (localStorage.fulfillment_method == 'pickup') {
      values.pickupLocation = JSON.parse(localStorage.myStore).id
      values.fulfillment_day = localStorage.pickupDay
      values.fulfillment_method = 'pickup'
      values.pickupLocation = localStorage.pickupLocation
  } else {
    values.pickupLocation = 0,
    values.fulfillment_day = localStorage.pickupDay
    values.fulfillment_method = 'delivery'
    values.pickupLocation = ''
  }
  // } else if (localStorage.fulfillment_method == 'delivery') {
  //   values.shipAddress = $('input[name="street-ship"]')
  //   values.shipCity = $('input[name="city-ship"]')
  //   values.shipState = $('input[name="state-ship"]')
  //   values.shipZip = $('input[name="zip-ship"]')
  //   values.fulfillment_method = 'delivery'
  // }

  var data = $('.list-item.active').data()
  values.fullName = $('input[name="full-name').val(),
  values.email = $('input[name="email"]').val()
  values.street = $('input[name="street-bill"]').val(),
  
  values.city = $('input[name="city-bill"]').val(),
  values.state = $('input[name="state-bill"]').val(),
  values.zip = $('input[name="zip-bill"]').val()
  values.password = $('input[name="password"]').val()
  values.pickupDay = data.day 
  values.pickupDate = data.date

  // values.fullName = "Mike Conrad"
  // values.email = "mkcnrd@gmail.com"
  // values.street = "86 Carroll Road",
  // values.state = "GA",
  // values.city = "Wildwood"
  // values.zip = "30767"
  // values.password = "password"
  // values.pickupDay = data.day 
  // values.pickupDate = data.date
  console.log(values)
$.ajax({
  type: "POST",
  url: "/checkout/stripe",
  // The key needs to match your method's input parameter (case-sensitive).
  data: JSON.stringify({data:values}),
  contentType: "application/json; charset=utf-8",
  dataType: "json",
  success: function(data){alert(JSON.stringify(data));},
  failure: function(errMsg) {
      alert(JSON.stringify(errMsg));
  }
});

  // $('.stripe-checkout').addClass('hidden').fadeOut()
  })
})

function checkPasswordMatch() {
    var password = $("#password").val();
    var confirmPassword = $("#password_verify").val();

    if (password != confirmPassword)
        $("#password_alert").html("Passwords do not match!");
    else if (password == confirmPassword) {
        $("#password_alert").html("Passwords match.");
        $('.checkout-form-row').not('.is-aligned-center').hide()

        $('.checkout-form-row.is-aligned-center').removeClass('hidden').fadeIn()

    }
}