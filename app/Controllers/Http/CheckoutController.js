'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const User = use('App/Models/User')
const Hash = use('Hash')
const fs = require('fs')
const Helpers = use('Helpers')
var orderCount = parseInt(fs.readFileSync(`${Helpers.appRoot()}/config/orderCounter.txt`))





class CheckoutController {

  // Simple function to apply a coupon to customers order during checkout.
  // Returns coupon details which get applied on the front end.
  async applyCoupon ({response, params}) {
    var couponDetails = await stripe.coupons.retrieve(params.coupon)
    return response.send(couponDetails)
  }

  async expressCheckout({ request, response, auth }) {
    orderCount += 1
    fs.writeFileSync(`${Helpers.appRoot()}/config/orderCounter.txt`, orderCount)


    var req = request.all()
    req = req.data
    var user = await auth.user
    const truth = req.billing.coupon === ""


    var update = await Database
      .table('users')
      .update({
        fulfillment_method: req.user.fulfillment_method,
        fulfillment_day: req.user.fulfillment_day,
        pickup_location: req.user.pickupLocation
      })
      .where('id', user.id)

    var customer = await stripe.customers.retrieve(auth.user.stripe_id)

    if (req.user.pickup_location) {
        var location = JSON.parse(req.user.pickup_location)
    }

    var cart = JSON.parse(req.cart)

    var stripeItems = []
    
    if (req.billing.shippingCode && req.user.fulfillment_method != 'pickup') {
      stripeItems.push({
        type: 'sku',
        parent: req.billing.shippingCode,
        quantity: 1
      })
    }
    
    for (var i = 0; i < cart.length; i++) {
      stripeItems.push({
        type: 'sku',
        parent: cart[i].sku,
        quantity: parseInt(cart[i].quantity)
      })
    }

    if (req.billing.type == 'new') {
      var source = await stripe.customers.createSource(customer.id, {
        source: req.billing.paymentId
      })  
    } else {
      var source = {id: req.billing.paymentId}
    }


    var address = req.billing.street
    var city = req.billing.city
    var state = req.billing.state
    var zip = req.billing.zip


    if (user) {
    
      if (req.user.fulfillment_method == 'pickup') {// Create an order for pickup
        var store = await Database
        .table('locations')
        .where('id', JSON.parse(req.user.pickup_location).id)
        
        var store = store[0]
        var location = {}

        location.address = store.street_addr
        location.city = store.city
        location.state = store.state
        location.zip = store.zip
        location.postalCode = store.zip


        var order = await stripe.orders.create({
          currency: 'usd',
          ...(!truth && {coupon: req.billing.coupon}),
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: user.name,
            address: {
              line1: store.name,
              line2: location.address,
              city: location.city,
              state: location.state,
              country: 'US',
              postal_code: store.zip,
            },
          },  
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            store_id: location.id,
            allergy_info: req.billing.allergy_info,
            delivery_info: req.billing.delivery_info,
            orderId: orderCount,
            deliveryWindow: req.billing.deliveryWindow
            
          },
          email: user.email
        }, function(err, order) {

          if (err){console.log(err);return err}
          stripe.orders.pay(order.id, {
            customer: customer.id,
            source: source.id // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            // asynchronously called

          });
        });
  
      } else {// Default to delivery if no method selected
        var order = await stripe.orders.create({
          currency: 'usd',
          ...(!truth && {coupon: req.billing.coupon}),
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: req.shipping.recipient ? req.shipping.recipient : user.name,
            address: {
              line1: req.shipping.street,
              city: req.shipping.city,  
              state: req.shipping.state,
              country: 'US',
              postal_code: req.shipping.zip,
            },
          },  
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            allergy_info: req.billing.allergy_info,
            delivery_info: req.billing.delivery_info,
            orderId: orderCount,
            deliveryWindow: req.billing.deliveryWindow

          },
          email: user.email
        }, function(err, order) {
          if (err){return err}
          stripe.orders.pay(order.id, {
            customer: customer.id,
            source: source.id // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)

            // asynchronously called
          });
        });
      }
      
      let newOrder = await stripe.orders.list({
        limit: 1,
        customer: customer.id
      })

      return response.send({status: 'success'}) 

      
    }
    // return response.send({status: 'success'})

  }


  async stripeCheckout({ request, response, auth }) {
    orderCount += 1

    var req = request.all()
    req = req.data

    const {email, firstName, lastName} = req.user

  if (req.user.pickup_location) {
      var location = JSON.parse(req.user.pickup_location)
    }
    var cart = JSON.parse(req.cart)
    var stripeItems = []
    if (req.billing.shippingCode && req.user.fulfillment_method == 'delivery') {
      stripeItems.push({
        type: 'sku',
        parent: req.billing.shippingCode,
        quantity: 1
      })
    }
    for (var i = 0; i < cart.length; i++) {
      stripeItems.push({
        type: 'sku',
        parent: cart[i].sku,
        quantity: parseInt(cart[i].quantity)
      })
    }

    // Create a local user
    const user = new User()
    user.name = req.user.firstName + ' ' + req.user.lastName
    user.email = req.user.email
    user.fulfillment_day = req.user.fulfillment_day
    user.fulfillment_method = req.user.fulfillment_method
    if (Env.get('NODE_ENV') === 'development') {
      user.user_level = 'admin'
    }



    if (req.user.fulfillment_method == 'pickup') {
      user.pickup_location = location.id

      var loc = await Database
        .table('locations')
        .where('id', location.id)
        .limit(1)
      loc = loc[0]
      var address = loc.street_addr
      location.address = loc.street_addr
      location.city = loc.city
      location.state = loc.state
      location.zip = loc.zip
      var city = loc.city
      var state = loc.state
      var zip = loc.zip

    } else {
      var address = req.billing.street
      var city = req.billing.city
      var state = req.billing.state
      var zip = req.billing.zip

    }

    user.password = await Hash.make(req.user.password)

    var customer = await stripe.customers.create({
      description: 'Customer for ' + email,
      source: req.billing.stripeToken,
      email: user.email,
      address: {
        line1: req.billing.street,
        city: req.billing.city,
        state: req.billing.state,
        postal_code: req.billing.zip
      },
      metadata: {
        name: user.name,
        fulfillment_method: req.user.fulfillment_method,
        fulfillment_day: req.user.fulfillment_day,
        delivery_date: req.user.fulfillment_date,
        next_fulfillment: req.user.fulfillment_date,
        allergy_info: req.billing.allergy_info,
        delivery_info: req.billing.delivery_info,
        orderId: orderCount,
        deliveryWindow: req.billing.deliveryWindow

      },
      shipping: {
        name: user.email,
        phone: req.user.phone,
        address: {
          line1: req.billing.street,
          city: req.billing.city,
          state: req.billing.state,
          postal_code: req.billing.zip
        }
      }
    })
    user.stripe_id = customer.id

    var curUser = await user.save()

    await auth.attempt(user.email, req.user.password)

  

    if (curUser) {
      var truth = req.billing.coupon === ""


      if (req.user.fulfillment_method == 'pickup') {// Create an order for pickup
        if (req.billing.coupon) {

        var order = await stripe.orders.create({
          currency: 'usd',
          ...(!truth && {coupon: req.billing.coupon}),
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: user.name,
            address: {
              line1: loc.name,
              line2: address,
              city: city,
              state: state,
              country: 'US',
              postal_code: req.billing.zip,
            },
          },
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            store_id: loc.id,
            allergy_info: req.billing.allergy_info,
            delivery_info: req.billing.delivery_info,
            orderId: orderCount,
            deliveryWindow: req.billing.deliveryWindow

          },
          email: user.email
        }, function(err, order) {

          if (err){return err}
          stripe.orders.pay(order.id, {
            
            source: customer.source // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)

          });
        });
        var newOrder = await stripe.orders.list({
          limit: 1,
          customer: customer.id
        })
        if (newOrder.orderId){
          return response.send({status: 'success'})
        } else {
          return response.send({status: 'waiting for order number'})
        }
              } else { //Pickup order without a coupon code
          var order = await stripe.orders.create({
            currency: 'usd',
            ...(!truth && {coupon: req.billing.coupon}),
            customer: customer['id'],
            items: stripeItems,
            shipping: { // shipping address could be either customers address for delivery or store address for pickup
              name: user.name,
              address: {
                line1: location.name,
                line2: address,
                city: location.city,
                state: location.state,
                country: 'US',
                postal_code: location.zip,
              },
            },  
            metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: req.user.fulfillment_method,
              pickup_location: location.name,
              allergy_info: req.billing.allergy_info,
              delivery_info: req.billing.delivery_info,
              orderId: orderCount,
              deliveryWindow: req.billing.deliveryWindow

            },
            email: user.email
          }, function(err, order) {
  
            if (err){return err}

            stripe.orders.pay(order.id, {
              source: customer.source // obtained with Stripe.js
            }, function(err, order) {
              if (err) return(err)
         
            });
          });
        }
      } else {// Default to delivery if no method selected
        var order = await stripe.orders.create({
          currency: 'usd',
          customer: customer['id'],
          ...(!truth && {coupon: req.billing.coupon}),
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: req.shipping.recipient ? req.shipping.recipient : user.name,
            address: {
              line1: req.shipping.street,
              city: req.shipping.city,  
              state: req.shipping.state,
              country: 'US',
              postal_code: req.shipping.zip,
            },
          },  
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            allergy_info: req.billing.allergy_info,
            delivery_info: req.billing.delivery_info,
            orderId: orderCount,
            deliveryWindow: req.billing.deliveryWindow

          },
          email: user.email
        }, function(err, order) {
          if (err){return err}
          stripe.orders.pay(order.id, {
            source: customer.source // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)

                    
          });
        });

      }

      
    }


  }

}

module.exports = CheckoutController
