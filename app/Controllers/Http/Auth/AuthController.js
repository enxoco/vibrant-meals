'use strict'
const Database = use('Database')
const { validateAll } = use('Validator')
const users = make('App/Services/UserService')
const User = use('App/Models/User')
const Helpers = use('Helpers')
const zipcodes = require('zipcodes')
const stripe = require('stripe')('sk_test_ZmWaFEiBn0H63gNmfCacBolp')
const ItemCategory = use('App/Models/ItemCategory')
const Item = use('App/Models/Item')

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

  async stepTwo ({ request, response, view, params, session }) {
    if (params.reg_method == 'user') {// Do user registration
      // Also we need to grab the users preffered location and add it to their profile
      session.put('needs_registration', 1)
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

  async showPickupOptions (zip) {

    var radArr = zipcodes.radius(zip, 20);

    const locations = await Database
      .from('locations')
      .select('*')
    var stores = []
      for (var i = 0; i < locations.length; i++) {
        for (var x = 0; x < radArr.length; x++) {
          var test = parseInt(radArr[x])
          if (test === locations[i].zip) {
            var dist = zipcodes.distance(zip, locations[i].zip); //In Miles

            stores.push({store: locations[i], dist: dist})
          }
        }
      }
      return stores
  }
  
  async showDeliveryOptions ({ view, request, response, session, params }) {
    const userZip = await session.get('zip')
    const radius = params.radius
    const storeZip = 37409
    var radArr = zipcodes.distance(params.zip, 37409);
    if (radArr > 25) {
      var is_deliverable = false
    } else {
      var is_deliverable = true
    }


      return view.render('auth.register-delivery', {dist: radArr, is_deliverable: is_deliverable})      
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
      return response.redirect('/')
    } catch (error) {
      session.flash({ error: 'Invalid Login Credentials' })
      return response.redirect('back')
    }
  }

  async showRegister ({ request, response, view }) {
    return view.render('auth.register')
  }

  async postGuestRegistration ({request, response, session, view}) {

    try {
      const userInfo = request.only(['email', 'zip', 'pickup', 'delivery', 'monday', 'wednesday'])

      const customer = stripe.customers.create({
        email: userInfo.email,
      })

     const stripeId = await customer //Get our stripe id
      
      if (userInfo.wednesday == 'on') {
        var fulDay = 'wednesday'
      } else {
        var fulDay = 'monday'
      }
      if (userInfo.pickup == 'on') {
        var fulMethod = 'pickup'
      } else {
        var fulMethod = 'delivery'
      }
      const newUser = await Database
      .table('users')
      .insert({email: userInfo.email, zip: userInfo.zip, fulfillment_method: fulMethod, fulfillment_day: fulDay, stripe_id: stripeId.id })

      session.put('adonis_auth', newUser)
      session.put('zip', userInfo.zip)


      session.flash({status: 'Account Created'})

      const stores = await this.showPickupOptions(userInfo.zip)
      return view.render(`auth.register-${fulMethod}`, {stores})
    } catch (error) {
      return response.send(`error from main function: ${error}`)
      if(error.code == 'ER_DUP_ENTRY') {
        session.flash({error: 'This email address is already in use'})
        return response.redirect('back')
      }
    }
return response.send('hello')
  }

  // async postRegister ({request, session, response}) {
  //   const userInfo = request.only(['name', 'email', 'password', 'password_confirmation'])
  //   const rules = {
  //     name: 'required|max:255',
  //     email: 'required|email|max:255|unique:users',
  //     password: 'required|min:6|max:30',
  //     password_confirmation: 'required_if:password|min:6|max:30|same:password'
  //   }

  //   const validation = await validateAll(userInfo, rules)

  //   if (validation.fails()) {
  //     session
  //       .withErrors(validation.messages())
  //       .flashExcept(['password'])

  //     return response.redirect('back')
  //   }

  //   await users.register(userInfo)

  //   response.redirect('/login')
  // }

  async logout ({ auth, response, session }) {
    await auth.logout()
    session.clear()
    response.redirect('/login')
  }


}

module.exports = AuthController
