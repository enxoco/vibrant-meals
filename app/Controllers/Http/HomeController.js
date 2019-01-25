'use strict'

const Database = use('Database')
class HomeController {
  async index ({ response, view, session }) {



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


  async showStores({request, response, view}) {
      const stores = await Database
        .table('locations')
        .select('*')
        var features = []
        for (var i = 0; i < stores.length; i++) {
          features.push({
            type:"Feature",
            geometry: {
              type: "Point",
              coordinates: [
                stores[i].longitude,
                stores[i].latitude
              ]
            },
            properties: {
              phoneFormatted: "(423) 555-5555",
              phone: "4235555555",
              address: stores[i].street_addr,
              postalCode: stores[i].zip,
              state: stores[i].state,
              city: stores[i].city,
              closing: stores[i].closing_time,
              desc: stores[i].name,
              storeId: stores[i].id
            }
          })

        }
        const geojson = {
          type: "FeatureCollection",
          features: features
        }
        return geojson
      return view.render('api.stores', {stores:geojson})
  }
}

module.exports = HomeController

