'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const moment = require('moment')
const User = use('App/Models/User')
const UsersProfile = use('App/Models/UsersProfile')
const Hash = use('Hash')
class CheckoutController {

  async paypalCheckout({ request, response }) {
    var order = request.all()
    return order
  }

  async applyCoupon ({response, params}) {
    var coupon = params.coupon
    var couponDetails = await stripe.coupons.retrieve(coupon)
    return response.send(couponDetails)
  }

  async expressCheckout({ request, response, auth }) {
    var req = request.all()
    req = req.data
    var user = await auth.user
    var customer = await stripe.customers.retrieve(auth.user.stripe_id)
    if (req.user.pickup_location) {
        var location = JSON.parse(req.user.pickup_location)
    }
    var cart = JSON.parse(req.cart)
    var stripeItems = []
    if (req.billing.shippingCode) {
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


    var address = req.billing.street
    var city = req.billing.city
    var state = req.billing.state
    var zip = req.billing.zip


    if (user) {
    
      if (req.user.fulfillment_method == 'pickup') {// Create an order for pickup
        if (req.billing.coupon) {

        var order = await stripe.orders.create({
          currency: 'usd',
          coupon: req.billing.coupon,
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: user.name,
            address: {
              line1: location.address,
              city: location.city,
              state: location.state,
              country: 'US',
              postal_code: location.postalCode,
            },
          },  
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            store_id: location.id
          },
          email: user.email
        }, function(err, order) {

          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.billing.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            // asynchronously called
          });
        });
        } else {
          var order = await stripe.orders.create({
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
                postal_code: location.postalCode,
              },
            },  
            metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: req.user.fulfillment_method,
              store_id: location.id
            },
            email: user.email
          }, function(err, order) {
  
            if (err){return err}
            stripe.orders.pay(order.id, {
              source: req.billing.stripeToken // obtained with Stripe.js
            }, function(err, order) {
              if (err) return(err)
              // asynchronously called
            });
          });
        }
      } else {// Default to delivery if no method selected
        var order = await stripe.orders.create({
          currency: 'usd',
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
          },
          email: user.email
        }, function(err, order) {
          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.billing.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            // asynchronously called
          });
        });
      }

      
    }


    if (order) {
      return response.send(order)
    } else {
      return response.send({'status': 'success'})
    }

  }

  async stripeCheckout({ request, response }) {
    var req = request.all()
    req = req.data


    if (req.user.pickup_location) {
      var location = JSON.parse(req.user.pickup_location)
    }
    var cart = JSON.parse(req.cart)
    var stripeItems = []
    if (req.billing.shippingCode) {
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


    if (req.user.fulfillment_method == 'pickup') {
      user.pickup_location = location.id
    }

    user.password = await Hash.make(req.user.password)



      var address = req.billing.street
      var city = req.billing.city
      var state = req.billing.state
      var zip = req.billing.zip

    var existing = await stripe.customers.list(
      { limit: 1, email: user.email },
    );
    if (existing.data[0] != undefined) {

    } else {
    var customer = await stripe.customers.create({
      description: 'Customer for ' + req.user.email,
      source: req.billing.stripeToken,
      email: user.email,
      metadata: {
        name: user.name,
        fulfillment_method: req.user.fulfillment_method,
        fulfillment_day: req.user.fulfillment_day,
        delivery_date: req.user.fulfillment_date,
        next_fulfillment: req.user.fulfillment_date
      },
      shipping: {
        name: user.email,
        phone: req.user.phone,
        address: {
          line1: address,
          city: city,
          state: state,
          postal_code: zip
        }
      }
    })
    }
    user.stripe_id = customer.id

    var newUser = await user.save()




    if (newUser) {
    
      if (req.user.fulfillment_method == 'pickup') {// Create an order for pickup
        if (req.billing.coupon) {

        var order = await stripe.orders.create({
          currency: 'usd',
          coupon: req.billing.coupon,
          customer: customer['id'],
          items: stripeItems,
          shipping: { // shipping address could be either customers address for delivery or store address for pickup
            name: user.name,
            address: {
              line1: location.address,
              city: location.city,
              state: location.state,
              country: 'US',
              postal_code: location.postalCode,
            },
          },  
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            store_id: location.id
          },
          email: user.email
        }, function(err, order) {

          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.billing.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            // asynchronously called
          });
        });
        } else {
          var order = await stripe.orders.create({
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
                postal_code: location.postalCode,
              },
            },  
            metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: req.user.fulfillment_method,
              store_id: location.id
            },
            email: user.email
          }, function(err, order) {
  
            if (err){return err}
            stripe.orders.pay(order.id, {
              source: req.billing.stripeToken // obtained with Stripe.js
            }, function(err, order) {
              if (err) return(err)
              // asynchronously called
            });
          });
        }
      } else {// Default to delivery if no method selected
        var order = await stripe.orders.create({
          currency: 'usd',
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
          },
          email: user.email
        }, function(err, order) {
          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.billing.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
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

  }

    async startCheckout({ request, response, session}) {
        var cart = session.get('cartItem')
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
