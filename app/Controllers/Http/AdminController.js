'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))

class AdminController {

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
        return response.send(prod[0])
        return view.render('admin.items', {items: prod, categories})
    }


    async test ({request, response}) {
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

                  for (var i = 1; i < Object.keys(form).length; i++) {
                    var sku = form[Object.keys(form)[i]]
                    var size = sku.size
                    size = size.toLowerCase()

                    stripe.skus.create({
                        product: id,
                        id: sku_id + '_' + size,
                        price: parseInt(price),
                        currency: 'usd',
                        inventory: {type: 'finite', quantity: 500},
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
                            calories: sku.calories
                        },
                      })
                  }

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
    //  addCoupon(request, response) {
    //   var form = request.all()

    //   const coupon = await stripe.coupons.create({
    //     percent_off: form.percentage,
    //     duration: 'forever',
    //     id: form.coupon_name
    //   }, function(err, coupon) {
    //     // asynchronously called
    //     if (coupon) {
    //       var message = 'Coupon created successfully'
  
    //     }
    //     if (err) {
    //       var message = err.message
    //     }
    //   });
      
    //   return response.send(message)
    // }
}

module.exports = AdminController
