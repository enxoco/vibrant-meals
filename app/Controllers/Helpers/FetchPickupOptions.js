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