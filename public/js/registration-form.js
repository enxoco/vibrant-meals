

// Create a Stripe client.

var stripe = Stripe("pk_test_RIU7I4O49GFzLUZHRafKTrtF");

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: "#32325d",
    lineHeight: "18px",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

// Create an instance of the card Element.
var card = elements.create("card", { style: style });

// Add an instance of the card Element into the `card-element` <div>.
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

var promo = document.getElementById('promoCode')
console.log(promo.value)
promo.addEventListener('keyup', function() {
  if (promo.value === 'small18') {
    form.action = '/subscribe/monthly/small'
  }
})
button1.onclick = function () {

  if (promo.value === 'renew2018') {
    document.getElementById('submit').click()

  } else {
    stripe.createToken(card).then(function (result) {
      $('input[name=stripeToken]').val(result.token.id)

    //   document.getElementById('submit').click()
    var $inputs = $('#checkout-form :input');


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
        values.pickupDay = localStorage.pickupDay
        values.fulfillment_method = 'pickup'
        values.pickupLocation = localStorage.pickupLocation
    } else if (localStorage.fulfillment_method == 'delivery') {

    }

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

    console.log(values)
    $('.stripe-checkout').addClass('hidden').fadeOut()
    })
  }
}
