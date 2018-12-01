'use strict'
const Database = use('Database')
const Item = use('App/Models/Item')
const moment = require('moment')

class HomeController {
  async index ({ response, view, session }) {
    console.log(`session: ${JSON.stringify(session.all())}`)
      if (session.get('adonis_auth')) {
        const user = await Database
        .table('users')
        .select('id', 'name', 'email', 'zip', 'fulfillment_method', 'is_guest', 'fulfillment_day')
        .where('id', session.get('adonis_auth'))  

        const items = await Database
        .select('*')
        .from('items')

        const today = moment().format('dddd hh:mm')
        const prefDay = user[0].fulfillment_day
        if (prefDay == 'wednesday') {// User has chosen to receive deliveries on Wednesday..
          var day = moment().format('dddd')
          if (day == 'Monday' || day == 'Tuesday') { // If we are still prior to cut off date, allow fulfillment this week
            const nextAvalDate = moment().add(0, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD')
            return view.render('welcome', {items, is_admin: false, user, nextAvalDate})
          } else {// We have passed the cut off for this week, need to schedule for next week.
            const nextAvalDate = moment().add(1, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD')
            return view.render('welcome', {items, is_admin: false, user, nextAvalDate})
          }
        } else {
          var day = moment().format('dddd')
          if (day == 'Friday' || day == 'Saturday' || day == 'Sunday' || day == 'Monday') {
            const nextAvalDate = moment().add(2, 'weeks').startOf('isoweek').format('dddd MMMM DD')
            const items = await Database
            .select('*')
            .from('items')
            console.log(nextAvalDate)
    
            return view.render('welcome', {items, is_admin: false, user, nextAvalDate})
          
          }

        }

        
      } else {
        const items = await Database
        .select('*')
        .from('items')
  
        return view.render('welcome', {items, is_admin: false})
  
      }

      // ToDo
      // Check if a user has completed their initial order.  If they have, that means that they have already
      // ordered with us and received an order.  If they have not, then we need to get the current day and 
      // compare it to their fulfillment_day preference.

      // If user has not completed initial order and todays date is less than 48 hours from their preferred
      // fulfillment time, then we need to set their first scheduled delivery for the following week.

      // For example if preferred pickup date is Wednesday, the cutoff time would be Monday night at 11:59PM.
      // So if we visit the site on Tuesday Morning, we should not be shown this week as a possible delivery.

      // session.put('initial_order_completed', user.initial_order_completed)

  }
}

module.exports = HomeController

