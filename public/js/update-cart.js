// Main function responsible for drawing the cart div on the screen.
// Relies on a cart being set in localstorage.
// Any function that calls this function should first update localstorage.cart

function updateCartDiv(fulfillment_method) {
  if($('#pickupRadioMobile').is(':checked')){$('.same-address').hide()}


  var orderMethod = localStorage.fulfillment_method
  var orderDay = localStorage.fulfillment_day


  if (localStorage.fulfillment_date) {
    $('.list-group-item.clickable').removeClass('active')
    $('#pickupDaysList').find('[data-date="'+localStorage.fulfillment_date+'"]').addClass('active')
  }


  $('#'+orderMethod+'Radio').closest('.fulfillment-option').addClass('active')

  if (window.location.href.includes('checkout')) {
    $('.cart-heading').html('Order Info')
    var d = '<div class="col d-flex mt-4 hidden-on-mobile-checkout">\
    <div class="col-2 fulfillment-option">\
    <a id="deliveryDate" data-toggle="modal" data-target="#orderDetailsModal">\
    <div class="cart-icon">\
    <img src="/images/calendar.png" style="font-size:4em; color:#3b8f6b;"/>\
    </div>\
    </div><div class="col fulfillment-option"><div class="cart-icon-label" id="delivery-date-label">Click for shipping/delivery Details\
    </div></a></div></div>'
    // $('.row.mb-5.pl-3').append(d)
    $('#order-info').html(d)


    if (localStorage.fulfillment_day) {
      $('#fulfillment-date').val(localStorage.fulfillment_day.charAt(0).toUpperCase() + localStorage.fulfillment_day.slice(1) + ' - ' + localStorage.fulfillment_date)
      $('.delivery-date-label, #delivery-date-label').html('<strong>'+capitalize(localStorage.fulfillment_method) + ' Date</strong> <br /><a href="#" id="update-fulfillment-day">' + $('.list-group-item.clickable.active').data('day') + ' - ' + $(".list-group-item.clickable.active").data("date") + '</strong></a>')

    }
  }

    if (localStorage.pickupLocation && localStorage.pickupLocation != "undefined") {      
      var pickup = JSON.parse(localStorage.pickupLocation).desc
      $('.cart-icon-label.pickup').html(pickup)
    } else {
      $('.cart-icon-label.ls').html()
    }

    var cartCount = 0
    var total = 0
    if (localStorage.cart) {
        var cartItems = JSON.parse(localStorage.cart)
    }
    $('.cart-row-master').html('')
    if (cartCount === 0) {
      $('.checkout-button').css('background','white')
      $('.checkout-button').css('color','black')
    }
    for (var i = 0; i < cartItems.length; i++) {
      cartCount += cartItems[i].quantity
      if (cartCount < 5) {
        var button = $('.checkout-button')
        switch(cartCount) {
          case 0:
            button.css('background', 'white')
            break;
          case 1:
              button.css('background', 'rgb(59,143,107)')
              button.css('color', 'black')
              button.css('background', 'linear-gradient(90deg, rgba(59,143,107,1) 0%, rgba(59,143,107,1) 20%, rgba(255,255,255,1) 20%)')
              break;
          case 2:
              button.css('background', 'rgb(59,143,107)')
              button.css('color', 'black')
              button.css('background', 'linear-gradient(90deg, rgba(59,143,107,1) 0%, rgba(59,143,107,1) 40%, rgba(255,255,255,1) 40%)')
              break;
              case 3:
                  button.css('background', 'rgb(59,143,107)')
                  button.css('color', 'black')
                  button.css('background', 'linear-gradient(90deg, rgba(59,143,107,1) 0%, rgba(59,143,107,1) 60%, rgba(255,255,255,1) 60%)')
                  break;
                  case 4:
                      button.css('background', 'rgb(59,143,107)')
                      button.css('color', 'black')
                      button.css('background', 'linear-gradient(90deg, rgba(59,143,107,1) 0%, rgba(59,143,107,1) 80%, rgba(255,255,255,1) 80%)')
                      break;
        }
        $('.express-checkout-default').attr('disabled', 'disabled')
        $('#toggleSections').attr('disabled', 'disabled')
        $('#createToken').attr('disabled', 'disabled')
        $('.checkout-button').attr('disabled', 'disabled')
        $('.express-checkout-status').html('Please add at least 5 items to cart').show()
        $('.tooltip-wrapper').attr('data-toggle', 'tooltip')
          $('[data-toggle="tooltip"]').tooltip('enable')
          $('.cart-minimum').show()
      } else {
        $('.checkout-button').css('background', '#3b8f6b')
        $('.checkout-button').css('color', 'white')

        $('.checkout-button').removeAttr('disabled')
        $('#toggleSections').removeAttr('disabled')
        $('.cart-minimum').hide()
        $('#createToken').removeAttr('disabled')
        $('.express-checkout-default').removeAttr('disabled')
        $('.express-checkout-status').hide()
        $('[data-toggle="tooltip"]').tooltip('disable')
      }

      localStorage.setItem('cartCount', cartCount)
        total += parseFloat((cartItems[i].quantity * cartItems[i].price).toFixed(3))
        var card = '<div class="row pl-3 pr-3">\
        <figure class="figure">\
          <img class="avatar figure-img pull-left mr-2 mt-3" src="'+cartItems[i].img_url.replace('http://', 'https://')+'"><span class="item-name">'+cartItems[i].name+'</span><br>\
          <div class="btn-group">\
          <button class="btn btn-circle" data-id="'+i+'" onclick="subCart('+i+')"><i data-feather="minus-circle"></i></button>\
          <button class="btn btn-circle">'+cartItems[i].quantity+'</button>\
          <button class="btn btn-circle" onclick="addCart('+i+')"><i data-feather="plus-circle"></i></button>\
      </div>\
          </figcaption>\
      </figure><hr class="mb-1">\
    </div>'
      // var card = '<div class="cart-items"><div class="cart-controls"><a href="#" onclick="addCart('+i+')"><img class="cart-control" src="/images/plus-icon.png"></a><br /><div class="item-quantity"><div id="item-quantity">'+cartItems[i].quantity+'</div></div><a href="#" class="cart-minus" data-id="'+i+'" onclick="subCart('+i+')"><img class="cart-control" src="/images/minus-icon.png"></a></div><img class="cart-image" src="'+cartItems[i].img_url+'" alt="Placeholder image" /><p class="title is-6">'+cartItems[i].name+'</p></div>'
      $('.cart-row-master').append(card)

    }
    $('.cart-total').html(cartCount)
    var tax = (total * .098)
    total = total + tax
    if(cartCount == 0){
      $('.order-count').closest('div').css('background', 'none')
      $('.order-count').html('')
    } else {
      $('.order-count').html(cartCount)

    } 
    $('.order-tax').html(tax.toFixed(2))
    $('.order-tax').attr('data-tax', tax.toFixed(2))
    $('.order-total').attr('data-total', total.toFixed(2))
    $('.order-total').html(total.toFixed(2))
    if (total >= 100) {
      localStorage.shippingCode = 'freeshipping'
      $('.order-shipping').html('0')
    }

    if (localStorage.fulfillment_method == 'pickup') {
      $('#delivery-fee').show()
    }
    feather.replace()
    var div = document.getElementsByClassName('list-unstyled')[0]
    div.scrollTo(0,div.scrollHeight);
    calcShipping()
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

  $('.price-change').on('click', function(e){


    e.preventDefault()
    var t = $(this).data()
    let id = $(this).closest('.card-product').data('id')
    let btn = $('body').find(`[data-id='button_${id}']`)
    let macro = t.macros
    var calories = 0
    var proteins = 0
    var fats = 0
    var carbs = 0
    if (macro.calories) calories = macro.calories
    if (macro.proteins) proteins = macro.proteins
    if (macro.fats) fats = macro.fats
    if (macro.carbs) carbs = macro.carbs
    let div = '<div class="col pr-0"><h5>' + calories  + 'g<br /><small>Calories</small></h5></div>\
    <div class="col pr-0"><h5>' + proteins  + 'g<br /><small>Proteins</small></h5></div>\
    <div class="col pr-0"><h5>' + fats + 'g<br /><small>Fats</small></h5></div>\
    <div class="col pr-0 d-none d-md-none d-lg-none d-xl-flex"><h5>'+ carbs  + 'g<br /><small>Carbs</small></h5></div>'

    let footerDiv = '<div class="col mx-auto" style="text-align:center;">\
    <strong>'+carbs+'</strong>\
    <br>\
    Calories\
    </div>\
    <div class="col mx-auto" style="text-align:center;">\
    <strong>'+calories+'</strong>\
    <br>\
    Fats\
    </div>\
    <div class="col mx-auto" style="text-align:center;">\
    <strong>'+proteins+'</strong>\
    <br>\
    Protein\
    </div>\
    <div class="col mx-auto" style="text-align:center;">\
    <strong>'+carbs+'</strong>\
    <br>\
    Carbs\
    </div>'

    btn.text(t.name)

    //Update price on product card
    $(this).closest('.card-body').find('.row').find('.price-label').text('$' + t.price)
    var u = $('body').find('.checkout-prompt-1[data-id="'+id+'"]')
    var x = $('body').find('.card[data-id="'+id+'"]')
    var y = $('body').find('.modal[data-id="'+id+'"]')
    let checkoutButtons = $('#product_' + id).find('.checkout-prompt-1')

    $('#macros-' + id).html(div)
    $('#macro-card-' + id).html(footerDiv)
    $('#product_' + id).find('.modal-card-price').html(t.price)
    let d = $('#product_' + id).data()
    d.variation = $(this).data('variation') 
    $('#product_' + id).attr('data-variation', $(this).data('variation'))
    let card = $('#product_' + id)
    // When a user makes a choice for a protein or flavor, etc, update our inputs with price and variation
    card.find('input[name="product[price]"]').val(t.price)
    card.find('input[name="product[variation]"]').val(t.variation)

    $('#product_' + id).find('.dropdown-toggle').text(t.variation)

  })