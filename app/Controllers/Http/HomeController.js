'use strict'

const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))

class HomeController {
  async index ({ response, view, session, auth }) {

    const user = auth.user

    if (user) {
      stripe.customers.retrieve(
        user.stripe_id,
        function(err, customer) {
          // asynchronously called
        }
      );
    }

      return view.render('welcome')

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
              coordinates: JSON.parse(stores[i].coordinates)
            },
            properties: {
              phoneFormatted: "(423) 555-5555",
              phone: "4235555555",
              address: stores[i].street_addr,
              postalCode: stores[i].zip,
              state: stores[i].state,
              city: stores[i].city,
              close: stores[i].closes,
              opens: stores[i].opens,
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

  async showStoresView({request, response, view}) {
      const stores = await Database
        .table('locations')
        .select('*')
        for (let [key, value] of Object.entries(stores)) {
          stores[key].coordinates = JSON.parse(stores[key].coordinates)
        }
        
        // stores[0].coordinates = JSON.parse(stores[0].coordinates)
      return view.render('locations', {stores})
  
  }
}

module.exports = HomeController

