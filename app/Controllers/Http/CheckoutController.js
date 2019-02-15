'use strict'
const Database = use('Database')
var stripe = require("stripe")("sk_test_ZmWaFEiBn0H63gNmfCacBolp");
const moment = require('moment')
const User = use('App/Models/User')
const UsersProfile = use('App/Models/UsersProfile')
const Hash = use('Hash')
class CheckoutController {

  async paypalCheckout({ request, response }) {
    var order = request.all()
    return order
  }

  async stripeCheckout({ request, response }) {
    var req = request.all()
    req = req.data

    if (req.pickupLocation) {
      var location = JSON.parse(req.pickupLocation)

    }
    var stripeItems = []
    for (var i = 0; i < req.cart.length; i++) {
      stripeItems.push({
        type: 'sku',
        parent: req.cart[i].sku,
        quantity: parseInt(req.cart[i].quantity)
      })
    }

    // Create a local user
    const user = new User()
    var name = req.fullName
    user.name = req.fullName
    user.email = req.email
    user.fulfillment_day = req.fulfillment_day
    user.fulfillment_method = req.fulfillment_method



    if (req.fulfillment_method == 'pickup') {
      user.pickup_location = JSON.parse(req.pickupLocation).storeId

    }

    user.password = await Hash.make(req.password)

    var newUser = await user.save()


      var address = req.street
      var city = req.city
      var state = req.state
      var zip = req.zip

    var existing = await stripe.customers.list(
      { limit: 1, email: user.email },
    );
    console.log(existing.data[0])
    if (existing.data[0] != undefined) {

    } else {
    var customer = await stripe.customers.create({
      description: 'Customer for ' + req.email,
      source: req.stripeToken,
      email: user.email,
      metadata: {
        name: user.name,
        password: user.password,
        fulfillment_method: req.fulfillment_method,
        fulfillment_day: req.fulfillment_day,
        next_fulfillment: req.pickupDate
      },
      shipping: {
        name: user.email,
        phone: req.phone,
        address: {
          line1: address,
          city: city,
          state: state,
          postal_code: zip
        }
      }
    })
    }


    if (newUser) {
      console.log('user created')
      if (req.fulfillment_method == 'pickup') {// Create an order for pickup
        console.log('pickup')
        console.log(customer)
        var order = stripe.orders.create({
          currency: 'usd',
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: user.name,
            address: {
              line1: location.address,
              city: location.city,
              state: location.state,
              country: 'US',
              postal_code: location.postCode,
            },
          },  
          metadata: {
            pickup_day: req.pickupDay,
            pickup_date: req.pickupDate,
            fulfillment_method: req.fulfillment_method,
            store_id: location.storeId
          },
          email: user.email
        }, function(err, order) {
          console.log('order created')
          console.log(order)
          console.log(err)
          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            console.log('created')
            // asynchronously called
          });
        });
      } else {// Default to delivery if no method selected
        console.log('delivery')
        var order = stripe.orders.create({
          currency: 'usd',
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: user.name,
            address: {
              line1: req['street-ship'],
              city: req['city-ship'],
              state: req['state-ship'],
              country: 'US',
              postal_code: req['zip-ship'],
            },
          },  
          metadata: {
            delivery_day: req.pickupDay,
            delivery_date: req.pickupDate,
            fulfillment_method: req.fulfillment_method,
          },
          email: user.email
        }, function(err, order) {
          console.log('order created')
          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            console.log('created')
            // asynchronously called
          });
        });
      }

      
    }


    if (order) {
      return response.send(order)
    } else {
      return response.send('something happened')
    }

        // console.log('payment', payOrder)
    // } else { // Order should be sent out for delivery
      
    //   const location = await Database
    //     .table('locations')
    //     .where('id', user.pickup_location)
    //     .first()
    //   // Before we can process an order we need to get the customers delivery information..

    //   const deliveryAddr = await Database
    //     .table('delivery_customer_metas')
    //     .select('*')
    //     .where('user_id', user.id)
    //     .first()

    //   if (deliveryAddr) { // If we have a delivery address, procede with order
    //     var order = await stripe.orders.create({
    //       currency: 'usd',
    //       items: stripeItems,
    //       shipping: { // shipping address could be either customers address for delivery or store address for pickup
    //         name: user.email, // At this point the user has not created an account and therefore we do not have a name
    //         address: {
    //           line1: deliveryAddr.street_addr,
    //           city: deliveryAddr.city,
    //           state: deliveryAddr.state,
    //           country: 'US',
    //           postal_code: deliveryAddr.zip
    //         }
    //       },
    //       metadata: {
    //         "method": "delivery",
    //         "fulfillment_day": user.fulfillment_day,
    //         "fulfillment_date": fulfillment_day
    //       },
    //       email: user.email
    //     });
    //     await Database
    //       .insert({
    //         user_id: 1,
    //         order_id: order.id,
    //         is_paid: 0
    //       })
    //       .table('orders')
    //     return response.send(order.id)
    //   } else { // We don't have address, need to send a form to user to get address

    //   }

    // }
  }

    async startCheckout({ request, response, session}) {
        var cart = session.get('cartItem')
        console.log('the cart is ', cart)
        var stripeItems = []
        for (var i = 0; i < cart.length; i++) {
            stripeItems.push({
              type: 'sku',
              parent: cart[i].sku,
              quantity: parseInt(cart[i].quantity),
            })

        }

        const user = await Database
        .table('users')
        .select('id', 'name', 'email', 'zip', 'fulfillment_method', 'is_guest', 'fulfillment_day', 'pickup_location')
        .where('id', session.get('adonis_auth'))  
        .first()

        var fulfillment_day = await session.get('fulfillment_day')
        fulfillment_day = moment(fulfillment_day).format('L')

        // Todo - need to distinguish between pickup and delivery
        // also need to decide between ala carte and subscription

        // Shipping info based on user preferences

    }
}

module.exports = CheckoutController
