// Main function responsible for drawing the cart div on the screen.
// Relies on a cart being set in localstorage.
// Any function that calls this function should first update localstorage.cart

function updateCartDiv() {
    if (localStorage.pickupLocation) {
      var pickup = JSON.parse(localStorage.pickupLocation).desc
      $('#cart').html('<h1 class="menu-subheading">Pickup OR Delivery</h1><div class="fulfillment-options flex-item"><a id="pickupRadio"><div class="cart-icon"><img src="/images/pickup-icon.png" alt="img"/></div><div class="cart-icon-label">'+pickup+'<div></div></div>\
      <a id="deliveryRadio"><div class="cart-icon"><img src="/images/delivery-icon.png" alt="img"/></div><div class="cart-icon-label"><div></div></div></a></div>\
      <h1 class="menu-heading">Cart</h1>')
    } else {
      $('#cart').html('<h1 class="menu-subheading">Pickup OR Delivery</h1><div class="fulfillment-options flex-item"><a id="pickupRadio"><div class="cart-icon"><img src="/images/pickup-icon.png" alt="img"/></div><div class="cart-icon-label"><div></div></div>\
      <a id="deliveryRadio"><div class="cart-icon"><img src="/images/delivery-icon.png" alt="img"/></div><div class="cart-icon-label"><div></div></div></a></div>\
      <h1 class="menu-heading">Cart</h1>')
    }

    var cartCount = 0
    if (localStorage.cart) {
        var cartItems = JSON.parse(localStorage.cart)
    }
  
    for (var i = 0; i < cartItems.length; i++) {
      cartCount += cartItems[i].quantity
      localStorage.setItem('cartCount', cartCount)
      var card = '<div class="cart-items"><div class="cart-controls"><a href="#" onclick="addCart('+i+')"><img class="cart-control" src="/images/plus-icon.png"></a><br /><div class="item-quantity"><div id="item-quantity">'+cartItems[i].quantity+'</div></div><a href="#" class="cart-minus" data-id="'+i+'" onclick="subCart('+i+')"><img class="cart-control" src="/images/minus-icon.png"></a></div><img class="cart-image" src="/'+cartItems[i].img_url+'" alt="Placeholder image" /><p class="title is-6">'+cartItems[i].name+'</p></div>'
      $('#cart').append(card)
    }

    $('#cart').append('</div></div>')
    if (localStorage.cartCount < 5) {
      $('#cart').append('<a class="button is-primary tooltip disabled checkout-button" data-tooltip="Please add at least 5 items to cart">Checkout</a>')
    } else if(localStorage.cartCount >= 5) {
      $('#cart').append('<a href="/checkout/test" class="button is-primary checkout-button">Checkout</a>')
    } else if (localStorage.cartCount == 1) {
      $('#cart').append('<div id="alert"><div class="notification is-primary checkout-warning"><button class="delete"></button>Please add at least 5 items to your cart</div></div><a class="button is-primary tooltip disabled checkout-button" data-tooltip="Please add at least 5 items to cart">Checkout</a>')
    } else if (localStorage.cartCount == 0) {
      $('#cart').html('a')
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