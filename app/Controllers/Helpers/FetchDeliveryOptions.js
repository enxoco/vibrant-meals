'use strict'
const Database = use('Database')
const zipcodes = require('zipcodes')


/**
 * 
 * The purpose of this function is to diplay stores close to a given
 * zip code.
 * 
 */
module.exports = async function(zip) {
  const storeZip = 37409
  var radArr = zipcodes.distance(zip, 37409);
  if (radArr > 25) {
    var is_deliverable = false
    return false
  } else {
    var is_deliverable = true
    return true
  }
}