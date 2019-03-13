// Main function responsible for drawing the cart div on the screen.
// Relies on a cart being set in localstorage.
// Any function that calls this function should first update localstorage.cart

function updateCartDiv() {

  var orderMethod = localStorage.fulfillment_method
  var orderDay = localStorage.fulfillment_day
  if (orderMethod == 'pickup') {
    if (!localStorage.pickupLocation) {
      localStorage.fulfillment_method = 'delivery'
      updateCartDiv()
    }
    var orderLocation = JSON.parse(localStorage.pickupLocation).name
  } else {

  }


  $('#'+orderMethod+'Radio').closest('.fulfillment-option').addClass('active')

  if($('#user-info').data()) {
    var user = $('#user-info').data()
    console.log(user.user.pickupLocation)
    localStorage.fulfillment_method = user.user.fulfillment_method
    localStorage.fulfillment_day = user.user.fulfillment_day
    localStorage.custEngageCompleted = 1
    localStorage.checkoutInitiated = 1
    localStorage.pickupLocation = JSON.stringify(user.user.pickupLocation)
  }
  if (window.location.href.includes('checkout')) {
    $('.cart-heading').html('Order Info')
    var d = '<div class="col d-flex mt-4">\
    <div class="col-2 fulfillment-option">\
    <a id="deliveryDate">\
    <div class="cart-icon">\
    <i class="fa fa-calendar" style="font-size:4em; color:#3b8f6b;"></i>\
    </div>\
    </div><div class="col fulfillment-option"><div class="cart-icon-label" id="delivery-date-label">\
    Your order will be ready for pickup between<br /> 8am and 4pm <br>Wednesday<br>Feb 27\
    </div></a></div></div>'
    // $('.row.mb-5.pl-3').append(d)
    $('#order-info').html(d)
    if ($('#express-checkout-details').html()) {
      $('#express-checkout-details').html('Order Type: <strong>'+orderMethod+'</strong><br /> '+ orderMethod +' Location: <strong>'+ JSON.parse(localStorage.pickupLocation).name + '</strong><br />'+ orderMethod + ' Window: <strong>Between 8am and 4pm </strong><br />Day: ' + orderDay )

    }
    

  }



    if (localStorage.pickupLocation && localStorage.pickupLocation != "undefined") {
      
      
      var pickup = JSON.parse(localStorage.pickupLocation).desc
      $('#pickupRadio').closest('.fulfillment-option').addClass('active')
      $('.cart-icon-label.pickup').html(pickup)
    } else {
      $('.cart-icon-label.delivery').html()
    }

    var cartCount = 0
    if (localStorage.cart) {
        var cartItems = JSON.parse(localStorage.cart)
    }
    $('.cart-row-master').html('')
    for (var i = 0; i < cartItems.length; i++) {
      cartCount += cartItems[i].quantity
      if (cartCount < 5) {
        $('.checkout-button').attr('disabled','disabled')
        console.log('less than 5')
      } else {
        $('.checkout-button').removeAttr('disabled')
      }
      localStorage.setItem('cartCount', cartCount)
      if (window.location.href.includes('checkout')) {

        var card = '<div class="row mb-5 pl-3 pr-3 order-info align-items-center"><div class="col"><img src="'+cartItems[i].img_url+'"/></div><div class="col">X '+cartItems[i].quantity+'</div><div class="col">$'+(cartItems[i].quantity * cartItems[i].price / 100).toFixed(2)+'</div>'
      } else {
        var card = '<div class="row mb-5 pl-3 pr-3 order-info">\
        <div class="col col-md-2 card-user">\
          <div class="row mr-0 ml-0 pb-3">\
            <a onclick="addCart('+i+')"><i class="nc-icon nc-simple-add"></i></a>\
          </div>\
          <div class="row mr-0 ml-0" style="border-radius: 50%;width: 35px;box-shadow: 2px 2px 7px 2px gainsboro;pointer-events: none;">\
            <span class="quantity">'+cartItems[i].quantity+'</span>\
          </div>\
          <div class="row mr-0 ml-0 pt-3">\
            <a data-id="'+i+'" onclick="subCart('+i+')"><i class="nc-icon nc-simple-delete"></i></a>\
          </div>\
        </div>\
        <div class="col col-md-5 pt-2">\
          <img class="avatar" src="'+cartItems[i].img_url+'">\
        </div>\
        <div class="col col-md-4 pt-2">\
          <span class="cart-item-label">'+cartItems[i].name+'</span>\
        </div>\
      </div>\
    </div>'
      }
      // var card = '<div class="cart-items"><div class="cart-controls"><a href="#" onclick="addCart('+i+')"><img class="cart-control" src="/images/plus-icon.png"></a><br /><div class="item-quantity"><div id="item-quantity">'+cartItems[i].quantity+'</div></div><a href="#" class="cart-minus" data-id="'+i+'" onclick="subCart('+i+')"><img class="cart-control" src="/images/minus-icon.png"></a></div><img class="cart-image" src="'+cartItems[i].img_url+'" alt="Placeholder image" /><p class="title is-6">'+cartItems[i].name+'</p></div>'
      $('.cart-row-master').append(card)
    }


  }

  // Functionality to increase/decrease cart quantity
  function subCart(id) {
    var cart = JSON.parse(localStorage.cart)
    count = localStorage.cartCount
    count--
    localStorage.setItem('cartCount', count)
    var updatedCart = []
    cart[id].quantity--
    for (var x = 0; x < cart.length; x++) {
      if (cart[x].quantity === 0) {
  
      } else {
        updatedCart.push(cart[x])
      }
    }
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    updateCartDiv()
  }
  
  function addCart(id) {
    var cart = JSON.parse(localStorage.cart)
    var updatedCart = []
    cart[id].quantity++
  
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCartDiv()

  }