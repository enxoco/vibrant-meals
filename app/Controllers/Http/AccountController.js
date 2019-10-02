'use strict'

const { validateAll } = use('Validator')
const users = make('App/Services/UserService')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const Database = use('Database')


class AccountController {

  async updateFulfillmentDay ({request, response, auth}) {
    const { fulfillment_day } = request.all()

    if (auth) {
      await Database
        .table('users')
        .update({
          fulfillment_day: fulfillment_day,
        })
        .where('id', auth.user.id)
        return response.send({status: 'Updated successfully'})
    }
  }

  async updateFulfillmentMethod ({request, response, auth}) {

    var method = request.all()
    var {storeId} = request.all()
    if (storeId) {
      await Database
      .table('users')
      .update({'pickup_location': method.storeId})
      .where('id', auth.user.id)
    }
    method = method.pref


    if (auth.user) {

      if (method == 'delivery') {
        await Database
          .table('users')
          .update({'pickup_location': null})
          .where('id', auth.user.id)
        await Database
          .table('users')
          .update({'fulfillment_method': 'delivery'})
          .where('id', auth.user.id)
          var update = await stripe.customers.update(auth.user.stripe_id, {
            metadata: {
              fulfillment_method: 'delivery'
            }
          })
      }
      if (method === 'Monday' || method === 'Thursday') {
        await Database
          .table('users')
          .update({'fulfillment_day': method})
          .where('id', auth.user.id)
        var update = await stripe.customers.update(auth.user.stripe_id, {
          metadata: {
            fulfillment_day: method
          }
        })
      } else if (method == 'pickup') {
        await Database
        .table('users')
        .update({'fulfillment_method': method})
        .where('id', auth.user.id)
        
        var update = await stripe.customers.update(stripe_id, {
          metadata: {
            fulfillment_method: method
          }
        })
      }
    }

    if (update) {
      return response.send(update)
    } else {
      return response.send('no changes')
    }

  }


  async edit ({ auth, view, response }) {
    try {
      let loginID = await auth.getUser()
      let loggedinUser = await users.findUserById(loginID.id)
      let linkedAccount = await users.getAllLinkedAccount(loginID)
      return view.render('account.profile', {account: loggedinUser, linkedAccount: linkedAccount})
    } catch (e) {
      response.redirect('/login')
    }
  }

  async updateBilling ({request, response, auth}) {
    var form = request.all()

    var id = auth.user.stripe_id

    var update = await stripe.customers.update(id, {
      shipping: {
        name: auth.user.email,
        address: {
          line1: form.street,
          city: form.city,
          state: form.state,
          postal_code: form.postal_code
        }
      }
    })

    return response.send(update)
  }

  async update ({ request, session, response, auth }) {
    const userInfo = request.only(['email', 'name', 'username', 'gender', 'location', 'website'])
    const rules = {
      name: 'required|max:255',
      email: 'required|email|max:255'
    }

    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password'])

      return response.redirect('back')
    }

    try {
      const loginID = await auth.getUser()
      await users.updateUserProfile(loginID, userInfo)
      session.flash({ status: 'Your Profile has been updated successfully' })
      return response.redirect('back')
    } catch (e) {
      session.flash({ error: 'Error while updating profile' })
      return response.redirect('back')
    }
  }

  async changePassword ({request, session, response, auth }) {
    const userInfo = request.only(['password', 'password_confirmation'])
    const rules = {
      password: 'required|min:6|max:30',
      password_confirmation: 'required_if:password|min:6|max:30|same:password'
    }

    const validation = await validateAll(userInfo, rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password', 'password_confirmation'])

      return response.redirect('back')
    }

    const loginID = await auth.getUser()
    await users.changeUserPassword(loginID, userInfo)
    session.flash({ status: 'Password has been changed successfully' })
    return response.redirect('back')
  }

  async destroy ({ auth, response }) {
    const loginID = await auth.getUser()
    await users.deleteUser(loginID)
    await auth.logout()
    response.redirect('/')
  }
}

module.exports = AccountController
