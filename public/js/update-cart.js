// Main function responsible for drawing the cart div on the screen.
// Relies on a cart being set in localstorage.
// Any function that calls this function should first update localstorage.cart

function updateCartDiv() {


  var orderMethod = localStorage.fulfillment_method
  var orderDay = localStorage.fulfillment_day
  if (orderMethod == 'pickup') {
    $('#delivery-fee').hide()
    if (!localStorage.pickupLocation) {
      localStorage.fulfillment_method = 'delivery'
      updateCartDiv()
    }

    var orderLocation = ''
    if (localStorage.pickupLocation) {
      orderLocation = JSON.parse(localStorage.pickupLocation).name
    }
  } else {

  }



  if (localStorage.fulfillment_date) {
    $('.list-group-item.clickable').removeClass('active')
    $('#pickupDaysList').find('[data-date="'+localStorage.fulfillment_date+'"]').addClass('active')
  }


  $('#'+orderMethod+'Radio').closest('.fulfillment-option').addClass('active')

  if($('#user-info').data()) {
    var user = $('#user-info').data()
    localStorage.fulfillment_method = user.user.fulfillment_method
    localStorage.fulfillment_day = user.user.fulfillment_day
    localStorage.custEngageCompleted = 1
    localStorage.checkoutInitiated = 1
    if (user.user.pickupLocation) {
      localStorage.pickupLocation = JSON.stringify(user.user.pickupLocation)
    }
  }
  if (window.location.href.includes('checkout')) {
    $('.cart-heading').html('Order Info')
    var d = '<div class="col d-flex mt-4">\
    <div class="col-2 fulfillment-option">\
    <a id="deliveryDate" data-toggle="modal" data-target="#orderDetailsModal">\
    <div class="cart-icon">\
    <img src="/images/calendar.png" style="font-size:4em; color:#3b8f6b;"/>\
    </div>\
    </div><div class="col fulfillment-option"><div class="cart-icon-label" id="delivery-date-label">Click for shipping/delivery Details\
    </div></a></div></div>'
    // $('.row.mb-5.pl-3').append(d)
    $('#order-info').html(d)

    if (localStorage.fulfillment_method == 'pickup') {
      if (localStorage.fulfillment_day) {
        $('#delivery-date-label').html('Your order will be ready for ' + localStorage.fulfillment_method + '<br /> On <strong>' + localStorage.fulfillment_day.charAt(0).toUpperCase() + localStorage.fulfillment_day.slice(1) + ' - ' + localStorage.fulfillment_date + '</strong><br /> You can pickup your order from <strong>' + JSON.parse(localStorage.pickupLocation).desc )
      } else {

      }
    }
    if (localStorage.fulfillment_day) {
      $('#delivery-fee').show()
      $('#fulfillment-date').val(localStorage.fulfillment_day.charAt(0).toUpperCase() + localStorage.fulfillment_day.slice(1) + ' - ' + localStorage.fulfillment_date)
      $('#delivery-date-label').html('Your order is scheduled for '+localStorage.fulfillment_method+' <br /> On <strong><a href="#" id="update-fulfillment-day">' + localStorage.fulfillment_day.charAt(0).toUpperCase() + localStorage.fulfillment_day.slice(1) + ' - ' + localStorage.fulfillment_date + '</strong><i data-feather="edit-3"></i></a>')
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
    var total = 0
    if (localStorage.cart) {
        var cartItems = JSON.parse(localStorage.cart)
    }
    $('.cart-row-master').html('')
    for (var i = 0; i < cartItems.length; i++) {
      cartCount += cartItems[i].quantity
      if (cartCount < 5) {
        $('.checkout-button').attr('disabled','disabled')
        $('.express-checkout-default').attr('disabled', 'disabled')
        $('#createToken').attr('disabled', 'disabled')
        $('.express-checkout-status').html('Please add at least 5 items to cart').show()
        $('.tooltip-wrapper').attr('data-toggle', 'tooltip')
          $('[data-toggle="tooltip"]').tooltip('enable')

      } else {
        $('.checkout-button').removeAttr('disabled')
        $('#createToken').removeAttr('disabled')
        $('.express-checkout-default').removeAttr('disabled')
        $('.express-checkout-status').hide()
        $('[data-toggle="tooltip"]').tooltip('disable')
      }
      localStorage.setItem('cartCount', cartCount)
        total += parseFloat((cartItems[i].quantity * cartItems[i].price / 100).toFixed(3))

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
      // var card = '<div class="cart-items"><div class="cart-controls"><a href="#" onclick="addCart('+i+')"><img class="cart-control" src="/images/plus-icon.png"></a><br /><div class="item-quantity"><div id="item-quantity">'+cartItems[i].quantity+'</div></div><a href="#" class="cart-minus" data-id="'+i+'" onclick="subCart('+i+')"><img class="cart-control" src="/images/minus-icon.png"></a></div><img class="cart-image" src="'+cartItems[i].img_url+'" alt="Placeholder image" /><p class="title is-6">'+cartItems[i].name+'</p></div>'
      $('.cart-row-master').append(card)

    }
    $('.order-total').attr('data-total', total)
    $('.order-total').html(total)


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

    /*
  *
  * When a user makes a selection based on size of item
  * we need to update all of the associated data-attributes
  * this is needed to parse the item properly and add it
  * to the cart ensuring that there are no duplicates.
  *
  */
 
  $('.price-change').change(function(){
    var t = $(this).find(':selected').data()
    var id = $(this).data('id')

    $(this).closest('.price').find('h5.price-label').text('$' + t.price / 100)
    var u = $('body').find('.checkout-prompt-1[data-id="'+id+'"]')
    var x = $('body').find('.card[data-id="'+id+'"]')
    var y = $('body').find('.modal[data-id="'+id+'"]')

    u.each(function(){
      $(this).attr('data-sku', t.sku)
      $(this).attr('data-img_url', t.img_url)
      $(this).attr('data-price', t.price)
      $(this).attr('data-name', _.capitalize(t.sku.replace(/_/g, ' ')))
    })

    x.each(function(){
      $(this).attr('data-sku', t.sku)
      $(this).attr('data-img_url', t.img_url)
      $(this).attr('data-price', t.price)
      $(this).attr('data-name', _.capitalize(t.sku.replace(/_/g, ' ')))
    })


    y.each(function(){
      $(this).attr('data-sku', t.sku)
      $(this).attr('data-img_url', t.img_url)
      $(this).attr('data-price', t.price)
      $(this).attr('data-name', _.capitalize(t.sku.replace(/_/g, ' ')))
    })


  })

