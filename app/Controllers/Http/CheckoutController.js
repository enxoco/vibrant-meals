'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const User = use('App/Models/User')
const Hash = use('Hash')
const fs = require('fs')
const Helpers = use('Helpers')
var configPath = `${Helpers.appRoot()}/config`
var orderCount = parseInt(fs.readFileSync(`${configPath}/orderCounter.txt`))
const ordersPath = `${configPath}/orders`
const Mailchimp = require('mailchimp-api-v3')
const mailchimp = new Mailchimp(Env.get('MAILCHIMP_API_KEY'))
const mcList = Env.get('MAILCHIMP_LIST_ID')
const moment = require('moment')



class CheckoutController {

    async createNewCustomer(){
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
          deliveryWindow: req.billing.deliveryWindow,
          tax: req.billing.tax,
          shipping: req.billing.shipping
  
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
    }

    async createDeliveryOrder(req, user, billing_info) {
      const amount = Number(req.billing.amount * 100).toFixed(0)


      var newDate = moment(`'${req.user.fulfillment_date} '` + moment().year()).format('MM-DD-YYYY')
      var fulfillment_week = moment(newDate, 'MM-DD-YYYY').week()

      if (req.billing.type === 'new') {
        var charge = await stripe.charges.create({
          amount: amount,
          currency: 'usd',
          source: req.billing.paymentId,
          metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: 'Delivery',
              allergy_info: req.billing.allergy_info,
              delivery_info: req.billing.delivery_info,
              orderId: orderCount,
              deliveryWindow: req.billing.deliveryWindow,
              tax: req.billing.tax,
              shipping: req.billing.shipping,
          }
        })
      } else {
        var charge = await stripe.charges.create({
          amount: amount,
          currency: 'usd',
          customer: user.stripe_id,
          metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: 'Delivery',
              allergy_info: req.billing.allergy_info,
              delivery_info: req.billing.delivery_info,
              orderId: orderCount,
              deliveryWindow: req.billing.deliveryWindow,
              tax: req.billing.tax,
              shipping: req.billing.shipping,
          }
        })
      }
      return charge
    }

    async createPickupOrder(req, user, store, shipping_info, billing_info){
      const amount = Number(req.billing.amount * 100).toFixed(0)

      var newDate = moment(`'${req.user.fulfillment_date} '` + moment().year()).format('MM-DD-YYYY')
      var fulfillment_week = moment(newDate, 'MM-DD-YYYY').week()


      if (req.billing.type === 'new') {
        var charge = await stripe.charges.create({
          amount: amount,
          currency: 'usd',
          source: req.billing.paymentId,
          metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: 'Pickup',
              store_id: store.id,
              allergy_info: req.billing.allergy_info,
              delivery_info: req.billing.delivery_info,
              orderId: orderCount,
              deliveryWindow: req.billing.deliveryWindow,
              tax: req.billing.tax,
              shipping: req.billing.shipping,
          }
        })
      } else {
        var charge = await stripe.charges.create({
          amount: amount,
          currency: 'usd',
          customer: user.stripe_id,
          metadata: {
              fulfillment_day: req.user.fulfillment_day,
              fulfillment_date: req.user.fulfillment_date,
              fulfillment_method: 'Pickup',
              store_id: store.id,
              allergy_info: req.billing.allergy_info,
              delivery_info: req.billing.delivery_info,
              orderId: orderCount,
              deliveryWindow: req.billing.deliveryWindow,
              tax: req.billing.tax,
              shipping: req.billing.shipping,
          }
        })
      }

      return charge


    }

  // Simple function to apply a coupon to customers order during checkout.
  // Returns coupon details which get applied on the front end.
  async applyCoupon ({response, params}) {
    try {
      var couponDetails = await stripe.coupons.retrieve(params.coupon)
      return response.send(couponDetails)
    } catch(e) {
      return response.send(e)
    }

  }

  async expressCheckout({ request, response, auth }) {
    orderCount += 1
    fs.writeFileSync(`${Helpers.appRoot()}/config/orderCounter.txt`, orderCount)

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

    if (user) {
      var billing_info = {
        address: req.billing.street,
        city: req.billing.city,
        state: req.billing.state,
        zip: req.billing.zip
      }
    
      if (req.user.fulfillment_method == 'pickup') {// Create an order for pickup
        var store = await Database
        .table('locations')
        .where('id', JSON.parse(req.user.pickup_location).id)
        
        var store = store[0]
        var shipping_info = {
          address : store.street_addr,
          city : store.city,
          state : store.state,
          zip : store.zip,
          postalCode : store.zip,
          name : auth.user.name,
          pickup_location : store.name
        }
        var charge = await this.createPickupOrder(req, user, store, shipping_info)
        var order = await this.saveNewOrder(req, customer, user, charge, shipping_info, billing_info, store.name)


  
      } else {// Default to delivery if no method selected
        var shipping_info = {
          address: req.shipping.street,
          city: req.shipping.city,
          state: req.shipping.state,
          zip: req.shipping.zip,
          name: auth.user.name,
        }
        var charge = await this.createDeliveryOrder(req, auth.user, shipping_info)
        var order = await this.saveNewOrder(req, customer, user, charge, shipping_info, billing_info, shipping_info.address)
      }
      




      return response.send({status: 'success'}) 

      
    }
    // return response.send({status: 'success'})

  }

  async saveNewOrder(req, customer, user, charge, shipping_info, billing_info,location){
    console.log(`request: ${req}, customer: ${customer}, user:`)
    try {
      var newDate = moment(`'${req.user.fulfillment_date} '` + moment().year()).format('YYYY-MM-DD')

      var order = await Database
      .table('orders')
      .insert({
        stripe_id: customer.id,
        user_id: user.id,
        items: req.cart,
        fulfillment_date: newDate,
        fulfillment_method: req.user.fulfillment_method,
        charge_id: charge.id,
        name: user.name,
        email: user.email,
        location: location,
        fulfillment_day: req.user.fulfillment_day,
        orderId: orderCount,
        allergy_info: req.billing.allergy_info,
        delivery_info: req.billing.delivery_info,
        payment_status: 'paid',
        order_status: 'pending',
        order_amount: charge.amount,
        created_at: moment().unix(),
        shipping_info: JSON.stringify(shipping_info),
        billing_info: JSON.stringify(billing_info),
        creation_week: moment().isoWeek(),
        
      })
      return order
    } catch(err) {
      console.log(err)
      return err
    }

  }

  async stripeCheckout({ request, response, auth, session }) {
    orderCount += 1

    var req = request.all()
    req = req.data

    const {email, firstName, lastName} = req.user
    
    mailchimp.post(`/lists/${mcList}/members`, {
      email_address : email,
      FNAME : firstName,
      LNAME : lastName,
      status : 'subscribed'
    
    })
    .then(function(results) {
      console.log(`these are the results ${results}`)
    })
    .catch(function (err) {
      // console.log(err)
    })

  if (req.user.pickup_location) {
      var location = JSON.parse(req.user.pickup_location)
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



    user.password = await Hash.make(req.user.password)
    try {
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
          deliveryWindow: req.billing.deliveryWindow,
          tax: req.billing.tax,
          shipping: req.billing.shipping
  
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

      var billing_info = {
        address: req.billing.street,
        city: req.billing.city,
        state: req.billing.state,
        zip: req.billing.zip
      }

      user.stripe_id = customer.id


  
      var curUser = await user.save()

      if (req.user.fulfillment_method == 'pickup') {
        var store = await Database
        .table('locations')
        .where('id', JSON.parse(req.user.pickup_location).id)
        
        var store = store[0]

        var shipping_info = {
          address : store.street_addr,
          city : store.city,
          state : store.state,
          zip : store.zip,
          postalCode : store.zip,
          name : user.name,
          pickup_location : store.name
        }
 
        var charge = await this.createPickupOrder(req, user, store, shipping_info)
        var order = await this.saveNewOrder(req, customer, user, charge, shipping_info, billing_info, store.name)
        console.log(`order: ${order}`)

      } else {
        var shipping_info = {}
        shipping_info.address = req.shipping.street
        shipping_info.city = req.shipping.city
        shipping_info.state = req.shipping.state
        shipping_info.zip = req.shipping.zip
        shipping_info.name = user.name
        var charge = await this.createDeliveryOrder(req, user, shipping_info)
        var order = await this.saveNewOrder(req, customer, user, charge, shipping_info, billing_info, shipping_info.address)

      }





      var newDate = moment(`'${req.user.fulfillment_date} '` + moment().year()).format('MM-DD-YYYY')
      var fulfillment_week = moment(newDate, 'MM-DD-YYYY').week()

  
      await auth.attempt(user.email, req.user.password)
      return response.send({'status': 'success'})
    } catch(e) {
      return response.send(e)
      await user.delete()
      return response.send(e)
    }


}
}





/*
* Old checkout code here.  This assumes that all items in cart also exist in stripe.
  // var truth = req.billing.coupon === ""


      // if (req.user.fulfillment_method == 'pickup') {// Create an order for pickup
      //   if (req.billing.coupon) {

      //   var order = await stripe.orders.create({
      //     currency: 'usd',
      //     ...(!truth && {coupon: req.billing.coupon}),
      //     customer: customer['id'],
      //     items: stripeItems,
      //     shipping: { // shipping address could be either customers address for delivery or store address for pickup
      //       name: user.name,
      //       address: {
      //         line1: loc.name,
      //         line2: address,
      //         city: city,
      //         state: state,
      //         country: 'US',
      //         postal_code: req.billing.zip,
      //       },
      //     },
      //     metadata: {
      //       fulfillment_day: req.user.fulfillment_day,
      //       fulfillment_date: req.user.fulfillment_date,
      //       fulfillment_method: req.user.fulfillment_method,
      //       store_id: loc.id,
      //       allergy_info: req.billing.allergy_info,
      //       delivery_info: req.billing.delivery_info,
      //       orderId: orderCount,
      //       deliveryWindow: req.billing.deliveryWindow,
      //       tax: req.billing.tax,
      //       shipping: req.billing.shipping

      //     },
      //     email: user.email
      //   }, function(err, order) {

      //     if (err){return err}
      //     stripe.orders.pay(order.id, {
            
      //       source: customer.source // obtained with Stripe.js
      //     }, function(err, order) {
      //       if (err) return(err)

      //     });
      //   });
      //   var newOrder = await stripe.orders.list({
      //     limit: 1,
      //     customer: customer.id
      //   })
      //   if (newOrder.orderId){
      //     return response.send({status: 'success'})
      //   } else {
      //     return response.send({status: 'waiting for order number'})
      //   }
      //         } else { //Pickup order without a coupon code
      //     var order = await stripe.orders.create({
      //       currency: 'usd',
      //       ...(!truth && {coupon: req.billing.coupon}),
      //       customer: customer['id'],
      //       items: stripeItems,
      //       shipping: { // shipping address could be either customers address for delivery or store address for pickup
      //         name: user.name,
      //         address: {
      //           line1: location.name,
      //           line2: address,
      //           city: location.city,
      //           state: location.state,
      //           country: 'US',
      //           postal_code: location.zip,
      //         },
      //       },  
      //       metadata: {
      //         fulfillment_day: req.user.fulfillment_day,
      //         fulfillment_date: req.user.fulfillment_date,
      //         fulfillment_method: req.user.fulfillment_method,
      //         pickup_location: location.name,
      //         allergy_info: req.billing.allergy_info,
      //         delivery_info: req.billing.delivery_info,
      //         orderId: orderCount,
      //         deliveryWindow: req.billing.deliveryWindow,
      //         tax: req.billing.tax,
      //         shipping: req.billing.shipping

      //       },
      //       email: user.email
      //     }, function(err, order) {
  
      //       if (err){return err}

      //       stripe.orders.pay(order.id, {
      //         source: customer.source // obtained with Stripe.js
      //       }, function(err, order) {
      //         if (err) return(err)
         
      //       });
      //     });
      //   }
      // } else {// Default to delivery if no method selected
      //   var order = await stripe.orders.create({
      //     currency: 'usd',
      //     customer: customer['id'],
      //     ...(!truth && {coupon: req.billing.coupon}),
      //     items: stripeItems,
      //     shipping: { // shipping address could be either customers address for delivery or store address for pickup
      //       name: req.shipping.recipient ? req.shipping.recipient : user.name,
      //       address: {
      //         line1: req.shipping.street,
      //         city: req.shipping.city,  
      //         state: req.shipping.state,
      //         country: 'US',
      //         postal_code: req.shipping.zip,
      //       },
      //     },  
      //     metadata: {
      //       fulfillment_day: req.user.fulfillment_day,
      //       fulfillment_date: req.user.fulfillment_date,
      //       fulfillment_method: req.user.fulfillment_method,
      //       allergy_info: req.billing.allergy_info,
      //       delivery_info: req.billing.delivery_info,
      //       orderId: orderCount,
      //       deliveryWindow: req.billing.deliveryWindow,
      //       tax: req.billing.tax,
      //       shipping: req.billing.shipping

      //     },
      //     email: user.email
      //   }, function(err, order) {
      //     if (err){
      //       console.log(err.message)
      //       session.flash({'error': 'Something went wrong'})
      //       return response.send('try again')
      //       return err
      //     }
      //     stripe.orders.pay(order.id, {
      //       source: customer.source // obtained with Stripe.js
      //     }, function(err, order) {
      //       if (err) return(err)

                    
      //     });
      //   });

      // }

*/

module.exports = CheckoutController
