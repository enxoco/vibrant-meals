'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const Drive = use('Drive')
const Helpers = use('Helpers')
const cheerio = require('cheerio')
const opencage = require('opencage-api-client');

class AdminController {


  async updateHowItWorks({request, response}) {

    const resourcesPath = Helpers.resourcesPath()
    const {id, content} = request.all()

    const template = await Drive.get(`${resourcesPath}/views/how-it-works.edge`, 'utf-8')
    
    const $ = cheerio.load(template, {
      decodeEntities: false,
      xmlMode: true,
      recognizeSelfClosing: false

    })

    $('#span1').html(content)

    await Drive.put(`${resourcesPath}/views/how-it-works.edge`, $.html())
  }


  async fulfillOrder ({params, response}) {
    var orderId = params.orderId

    var update = await stripe.orders.update(
      orderId,
      {status: 'fulfilled'},
    );

    return response.redirect('back')
  }

  async listLocations({view, response}) {
    var stores = await Database
    .from('locations')
    return view.render('layout.admin.locations', {stores})
  } 


  async insertLocation (description, street, city, state, zip, opens, closes, coords) {
    coords = JSON.stringify(coords)
    
    const insert = await Database

      .table('locations')
      .insert({
        name: description,
        description: description,
        street_addr: street,
        city: city,
        state: state,
        zip: zip,
        opens: opens,
        closes: closes,
        coordinates: coords
      })
  }

  async addLocations({request, response}) {
    const {description, street, city, state, opens, closes} = request.all()
    try {
      opencage.geocode({q: `${street} ${city} ${state}`}).then(data => {
        if (data.status.code == 200) {
          if (data.results.length > 0) {
            var place = data.results[0]
            var coords = []
            var zip = place.components.postcode.slice(0,5)
            coords.push(JSON.stringify(place.geometry.lng))
            coords.push(JSON.stringify(place.geometry.lat))
            var insert = this.insertLocation(description, street, city, state,zip, opens, closes, coords)
            return
  
             console.log(place.geometry);
          }
        } else if (data.status.code == 402) {
          console.log('hit free-trial daily limit');
          console.log('become a customer: https://opencagedata.com/pricing'); 
        } else {
          // other possible response codes:
          // https://opencagedata.com/api#codes
          console.log('error', data.status.message);
        }
      }).catch(error => {
        console.log('error', error.message);
      });
      return response.redirect('back')
    } catch(e) {
      return response.send({'error': 'error'})
    }

  }

  async deleteLocations({request, response, params}) {
    var id = params.id
    const update = await Database
      .table('locations')
      .delete()
      .where('id', id)

      return redirect('/admin/locations')

  }
  async updateLocations({view, request, params, response}) {

    var obj = {}
    for (let [key, value] of Object.entries(request.all())) {
      obj[key] = value
    }
    delete obj['_csrf']

    await Database
    .table('locations')
      .where('id', params.id)
      .update(obj)
    return response.redirect('back')
  }

  async importProducts({view, request, response}) {
    var products = await Drive.get('/tmp/products.csv')

    for (var i = 0; i < products.length; i++) {
      var prod = products[i]
      var product = await stripe.products.create({
        name: prod.name,
        type: 'good',
        description: prod.description,
        id: prod.id,
        attributes: ['size'],
        metadata: {
            primary_category: prod.metadata.primary_category
        }
      }, function(err, product) {
        // Now that primary product is created, we need to create skus
        // Start with the parent item

              for (var x = 1; x < products.skus.data.length; x++) {
                var sku = products.skus.data.length[x]
                var size = sku.size
                size = size.toLowerCase().replace(/ /g, '_')

                stripe.skus.create({
                    product: products[i].id,
                    id: sku.id + '_' + size,
                    price: parseInt(price),
                    currency: 'usd',
                    inventory: {type: 'finite', quantity: 500},
                    image: sku.image,
                    attributes: {
                        size: size
                    },
                    metadata: {
                        category: sku.category,
                        size: size,
                        fats: sku.metdata.fats,
                        carbs: sku.metadata.carbs,
                        proteins: sku.metadata.proteins,
                        calories: sku.metadata.calories
                    },
                  })
              }

    });
    }

    return response.send(JSON.parse(products))
    // var importFile = await Drive.get('/tmp/products.csv', 'utf-8')
    // importFile = importFile.split('\n')
    // var products = await stripe.products.list()
    // var file = await Drive.put('/tmp/products.csv', JSON.stringify(products.data))

    // return response.send(file)
  }

  async listCoupons ({view, response}) {
    const coupons = await stripe.coupons.list()
    return view.render('admin.coupons', {coupons})
  }

  async listCustomers({view}) {

    // Grab all customers from Stripe
    var customers = await stripe.customers.list()
    customers = customers.data

    // Initialize empty variable to hold user's lifetime spending
    var totalSpend = 0

    // For each customer, pull a list of their orders.
    for (var i = 0; i < customers.length; i++) {
      var order = await stripe.orders.list({
        customer: customers[i].id,
      })

      // Loop over all orders for a user and grab the total amounts
      for (var x = 0; x < order.data.length; x++) {
        totalSpend += order.data[i].amount
      }

      // Add the lifetime spending for the customer onto customer object
      customers[i].totalSpend = totalSpend
      // Add customers most recent order to their object
      customers[i].recent_order = order.data[0]
    }

    return view.render('admin.customers', {customers})
  }

    async showItems ({ view, response }) {
        var prod = await stripe.products.list();
        prod = prod.data
        var categories = []
        for (var i = 0; i < prod.length; i++) {
          categories.push(prod[i].metadata.primary_category)
        }
        return view.render('admin.items', {items: prod, categories})
    }


    async addItem ({request, response}) {
        var form = request.all()

        var prod = form.parent_product

        var id = prod.name.replace(/ /g, '_')
        id = id.toLowerCase()

        var sku = form['parent_product']

        var sku_id = id
        var price = String(sku.price).replace(".", "")
        if(price.length == 2) {
          price += '0'
        }

        var product = await stripe.products.create({
            name: prod.name,
            type: 'good',
            description: prod.description,
            id: id,
            attributes: ['size'],
            metadata: {
                primary_category: sku.category
            }
          }, function(err, product) {
            // Now that primary product is created, we need to create skus
            // Start with the parent item
                      var sku = form['parent_product']
                      var size = sku.size
                      size = size ? size.toLowerCase().replace(/ /g, '_').replace(/ /g, '_') : 'everyday'

                    stripe.skus.create({
                      product: id,
                      id: sku_id + '_' + size,
                      price: parseInt(price),
                      currency: 'usd',
                      inventory: {
                        type: 'finite', 
                        quantity: 500
                      },
                      image: prod.primary_img,
                      attributes: {
                          size: size
                      },
                      metadata: {
                          category: sku.category,
                          size: size,
                          fats: sku.fats,
                          carbs: sku.carbs,
                          proteins: sku.proteins,
                          calories: sku.calories,
                          filters: sku.filters
                      },
                    }, function(err, product) {
                      // Create our secondary skus in this function
                      for (var i = 1; i < Object.keys(form).length; i++) {
                        var sku = form[`variation_${i}`]
                        var size = sku.size
                        var price = String(sku.price).replace(".", "")
                        if(price.length == 2) {
                          price += '0'
                        }
                        console.log(price)
                        size = size ? size.toLowerCase().replace(/ /g, '_').replace(/ /g, '_') : 'everyday'
                        stripe.skus.create({
                          product: id,
                          id: sku_id + '_' + size,
                          price: parseInt(price),
                          currency: 'usd',
                          inventory: {
                            type: 'finite', 
                            quantity: 500
                          },
                          image: prod.primary_img,
                          attributes: {
                              size: size
                          },
                          metadata: {
                              category: sku.category,
                              size: size,
                              fats: sku.fats,
                              carbs: sku.carbs,
                              proteins: sku.proteins,
                              calories: sku.calories,
                              filters: sku.filters
                          },
                        })
                      }
                    })
        });
          return response.send(product)
    }


    async addCoupon ({ request, response }) {
      const couponData = request.only(['percentage', 'coupon_name'])
      try {
        const status = await this.createCoupon(couponData)
        return response.send(status)
      } catch (e) {
        return response.send(e.message)
      }
    }
  
    createCoupon (couponData) {
      return new Promise((resolve, reject) => {
        stripe.coupons.create({
          percent_off: couponData.percentage,
          duration: 'forever',
          id: couponData.coupon_name
        }, (err) => {
          if (err) { return reject(err) }
          return resolve('Coupon Created')
        });
      })
    }
}

module.exports = AdminController
