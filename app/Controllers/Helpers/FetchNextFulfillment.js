'use strict'
const moment = require('moment')


/**
 * 
 * The purpose of this module is to return the next available day for pickup
 * or delivery based on the customers preference and the day of the week.
 * 
 * It should return an object containing the day that the current order will
 * be ready for fulfillment as well as the method of fulfillment
 * 
 * return {
 *  nextFulfillment: 
 *  fulfillmentMethod: 
 * }
 * 
 * Need to pass in a user,
 * 
 */
module.exports = async function(prefDay) {
  
  if (prefDay == 'wednesday') {// User has chosen to receive deliveries on Wednesday..
    var day = moment().format('dddd')
    if (day == 'Monday' || day == 'Tuesday') { // If we are still prior to cut off date, allow fulfillment this week
      return moment().add(0, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD')
    } else {// We have passed the cut off for this week, need to schedule for next week.
      return moment().add(1, 'weeks').startOf('isoweek').add(2, 'days').format('dddd MMMM DD')
    }
  } else {// Need to work on this, currently no view is being rendered when monday is chosen
      var day = moment().format('dddd')
        if (day == 'Friday' || day == 'Saturday' || day == 'Sunday' || day == 'Monday') {
          return moment().add(2, 'weeks').startOf('isoweek').format('dddd MMMM DD')    
        } else {
          return moment().add(1, 'weeks').startOf('isoweek').format('dddd MMMM DD')
        }
  }
}