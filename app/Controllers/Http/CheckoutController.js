'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const moment = require('moment')
const User = use('App/Models/User')
const UsersProfile = use('App/Models/UsersProfile')
const Hash = use('Hash')
const stringHash = require('@sindresorhus/string-hash');




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
            store_id: location.id,
            orderId: stringHash(order.id)

            
          },
          email: user.email
        }, function(err, order) {

          if (err){return err}
          stripe.orders.pay(order.id, {
            source: req.billing.stripeToken // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            // asynchronously called
            stripe.orders.update(order.id, {
              metadata: {
                orderId: stringHash(order.id)
              }
            })
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
              source: customer.source // obtained from Stripe api
            }, function(err, order) {
              if (err) return(err)
              stripe.orders.update(order.id, {
                metadata: {
                  orderId: stringHash(order.id)
                }
              })
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
            stripe.orders.update(order.id, {
              metadata: {
                orderId: stringHash(order.id)
              }
            })
            // asynchronously called
          });
        });
      }

      
    }


    if (order) {
      console.log(order)
      return

    } else {
      console.log(order)
      return response.send({'status': 'success'})
    }
    console.log('hello')
    return

  }


  async stripeCheckout({ request, response, auth }) {
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
    var existing = await stripe.customers.list(
      {
        limit: 1,
        email: req.user.email
      }
    )

    if (existing.data.length == 0) {
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
  } else {
    var curUser = await Database
      .table('users')
      .where('email', req.user.email)
    var customer = existing.data[0]
    await auth.attempt(user.email, req.user.password)

  }

    if (curUser) {
    
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
              line1: address,
              city: city,
              state: state,
              country: 'US',
              postal_code: postalCode,
            },
          },
          metadata: {
            fulfillment_day: req.user.fulfillment_day,
            fulfillment_date: req.user.fulfillment_date,
            fulfillment_method: req.user.fulfillment_method,
            store_id: location.id,
          },
          email: user.email
        }, function(err, order) {

          if (err){return err}
          stripe.orders.pay(order.id, {
            source: customer.source // obtained with Stripe.js
          }, function(err, order) {
            if (err) return(err)
            stripe.orders.update(order.id, {
              metadata: {
                orderId: stringHash(order.id)
              }
            })
          });
        });
        } else { //Pickup order without a coupon code
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
            },
            email: user.email
          }, function(err, order) {
  
            if (err){return err}
            console.log(customer.source)

            stripe.orders.pay(order.id, {
              source: customer.source // obtained with Stripe.js
            }, function(err, order) {
              if (err) return(err)
              stripe.orders.update(order.id, {
                metadata: {
                  orderId: stringHash(order.id)
                }
              })            
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
            stripe.orders.update(order.id, {
              metadata: {
                orderId: stringHash(order.id)
              }
            })
                    
          });
        });
      }

      
    }


    if (order) {
      return response.send(order)
    } else {
      return response.send({'status':'success'})
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
