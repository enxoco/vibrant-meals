'use strict'
const Database = use('Database')
const Env = use('Env')
const { validateAll } = use('Validator')
const users = make('App/Services/UserService')
const stripe = require('stripe')(Env.get('STRIPE_SK'))


class AuthController {


  async testOrder ({ request, response, session, view }) {
    console.log(session.all())
    const user = await Database
      .table('users')
      .select('stripe_id')
      .where('id', 1)
      .limit(1)
      console.log(`stripe id: ${user[0].stripe_id}`)

    const plans = await Database
      .table('items')
      .select('stripe_id')

      console.log(`plans: ${plans[0].stripe_id}, ${plans[1].stripe_id}`)
    var items = []
    for (var i = 0; i < plans.length; i++) {
      items.push({plan: plans[i].stripe_id})
    }

    if (plans.length > 4 && plans.length < 10) {// Apply a coupon for 5 - 10 items
      stripe.subscriptions.create({
        customer: user[0].stripe_id,
        items: items,
        coupon: 'k8dED2L5'
      })
    } else {
      stripe.subscriptions.create({
        customer: user[0].stripe_id,
        items: items,
      })
    }

  }
  async showLogin ({ view }) {
    return view.render('auth.login')
  }


  async viewProfile ({request, response, auth, view}) {
    if (auth.user.id) {
      var user = auth.user
      var id = user.stripe_id

    // Grab all customers from Stripe
    var customer = await stripe.customers.retrieve(id)
    // customers = customers.data

    // Initialize empty variable to hold user's lifetime spending
    var totalSpend = 0

    // For each customer, pull a list of their orders.
      var order = await stripe.orders.list({
        customer: id,
      })

      // Loop over all orders for a user and grab the total amounts
      for (var x = 0; x < order.data.length; x++) {
        totalSpend += order.data[x].amount
      }

      // Add the lifetime spending for the customer onto customer object
      customer.totalSpend = totalSpend
      // Add customers most recent order to their object
      customer.recent_order = order.data[0]
      customer.orders = order
      return view.render('account.profile', {customer})
    }
  }

  async updateCustomerAddress ({ request, response, view, params, session }) {
    if (params.reg_method == 'user') {// Update a users profile with address
      // session.put('needs_registration', 1)
      const user = session.get('adonis_auth')

      const req = request.all()
      
      const update = await Database
        .table('delivery_customer_metas')
        .insert({
          user_id: user,
          street_addr: req.st_addr,
          city: req.city,
          state: req.state,
          zip: req.zip
        })
      
      return response.send(update)
      // var location = request.only(['location'])
      // var locationId = location.location

    
      // if (location) {
      //   var id = session.get('adonis_auth')
      //   await Database
      //     .table('users')
      //     .update({
      //       pickup_location: locationId
      //     })
      //     .where('id', id)
        
      //   session.put('locationId', locationId)
      // }
      // console.log('step two')
      // return response.redirect('/')

    
    } else {// Just show menu and continue as guest
      session.put('needs_registration', 0)
      console.log(`all: ${request.all()}`)

      var location = request.only(['location'])
      var locationId = location.location

      if (location) {
        var id = session.get('adonis_auth')
        await Database
          .table('users')
          .update({
            pickup_location: locationId
          })
          .where('id', id)
        session.put('locationId', locationId)

      }

      return response.redirect('/')
    }
  }


  async postLogin ({request, session, auth, response}) {
    const userInfo = request.all()
    const rules = {
      email: 'required',
      password: 'required'
    }



    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    try {
      await users.login(userInfo, auth)
      console.log('login')
      return response.redirect('/')
    } catch (error) {
      console.log('error')
      session.flash({ error: 'Invalid Login Credentials' })
      return response.redirect('back')
    }
  }

  async showRegister ({ request, response, view }) {
    const ip = "75.136.21.180"
    return view.render('auth.register')
  }


   async logout ({ auth, response, session }) {

    await auth.logout()
    session.clear()
    response.redirect('/')
  }


}

module.exports = AuthController
