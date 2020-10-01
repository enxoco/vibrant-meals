'use strict'
const Database = use('Database')
const Env = use('Env')
const { validateAll } = use('Validator')
const users = make('App/Services/UserService')
const stripe = require('stripe')(Env.get('STRIPE_SK'))


class AuthController {

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
      var orders = await Database
      .table('orders')
      .select()
      .where('user_id', auth.user.id)
      for (var i = 0; i < orders.length; i++) {
        orders[i].shipping_info = JSON.parse(orders[i].shipping_info)
        orders[i].billing_info = JSON.parse(orders[i].billing_info)
        orders[i].items = JSON.parse(orders[i].items)
        
      }
      return view.render('account.profile', {customer, orders})
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
      return response.send({message: 'Login Success'})
    } catch (error) {  // This is generic and doesn't give us any clue as to what actually failed.
      // Let's first check if the user exists.

      
      var user = await users.checkUser(userInfo)
      return response.send(user)
      return response.redirect('back')
    }
  }



   async logout ({ auth, response, session }) {

    await auth.logout()
    session.clear()
    response.redirect('/')
  }


}

module.exports = AuthController
