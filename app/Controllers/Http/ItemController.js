'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const path = Helpers.appRoot()
const _ = require('lodash')

const stripe_pk = Env.get('STRIPE_PK')

stripe.setApiVersion('2019-03-14');


var cartCur = []

class ItemController {

  async updateItems() {

    try {
      //Beware Stripe api defaults to limit of 10 products when doing a listing.
      var products = await stripe.products.list({limit:100})
      var prod = products.data

      for (var i = 0; i < prod.length; i++) {
        var sku = await stripe.skus.list(
          {product: prod[i].id}
        )
        prod[i].skus = sku
      }
      
      await Drive.put(`${path}/products.json`, JSON.stringify(prod))
    } catch(error) {
      return error
    }
    return 'success'



  }

  async showIp(response) {
    return console.log(response)
  }

  async listItems ({view, response, auth, request, params}) {



    const path = Helpers.appRoot()    

    var prod = await Database
      .table('products')
      .select('*')
    var categories = []
    var filters = []

    if (params.categories && params.filters) {
      var filter_categories = params.categories.split(',')
      var filter_filters = params.filters.split(',')
      var finalProd = []
      
      for (var i = 0; i < prod.length; i++) {
        prod[i].macros = JSON.parse(prod[i].macros)
        prod[i].variations = JSON.parse(prod[i].variations)

        for (var x = 0; x < filter_categories.length; x++) {

          var cat = prod[i].category
          if (filter_categories[x] === cat || filter_categories[x] === 'all') {
            for (var y = 0; y < filter_filters.length; y++) {
              if (filter_filters[y] === prod[i].skus.split('_')[0] || filter_filters[y] === 'all') finalProd.push(prod[i])
            }
          }

        }

        if(typeof prod[i].category == "string" && !categories.includes(prod[i].category.charAt(0).toLowerCase() + prod[i].category.slice(1))) {
          categories.push(prod[i].category.charAt(0).toLowerCase() + prod[i].category.slice(1))
        } 
      }
    } else {
      for (var i = 0; i < prod.length; i++) {
        prod[i].macros = JSON.parse(prod[i].macros)
        prod[i].variations = JSON.parse(prod[i].variations)

        if(typeof prod[i].category == "string" && !categories.includes(prod[i].category.charAt(0).toLowerCase() + prod[i].category.slice(1))) {
          categories.push(prod[i].category.charAt(0).toLowerCase() + prod[i].category.slice(1))
        } 
      }
    }



    if (auth.user) {
      var user = {}
      if (auth.user.fulfillment_method == 'pickup' && auth.user.pickup_location != null) {
        var store = await Database 
        .table('locations')
        .select('*')
        .where('id', auth.user.pickup_location)
        store[0].desc = store[0].name
        user.pickupLocation = store[0]
        user.fulfillment_method = 'pickup'

      } else {
        user.fulfillment_method = 'delivery'

      }
      user.fulfillment_day = auth.user.fulfillment_day
    }

      prod = _.orderBy(prod, ['category', 'updated'], ['desc', 'desc']);

    
      if (finalProd) {
        var items = finalProd
      } else {
        items = prod
      }

      if (auth.user) return view.render('menu.menu', {items: items, categories: categories, user})
      return view.render('menu.menu', {items: items, categories: categories})
      

  }





  /* Show form for editing a current item */

  async listItemsAdmin ({view, response, params}) {



    var product = await Database
        .table('products')
        .select('*')
        .where('id', params.sku)

    product = product[0]
    product.macros = JSON.parse(product.macros)
    return view.render('admin.items-new', {product, edit: true})

  }

  /**
   * 
   * These are admin related functions for managing menus on the item
   * 
   */
    async hideItem ({ params, response, session }) {
      const update = await Database
        .table('products')
        .where('id', params.itemId)
        .update('active', false)
      const name = await Database
        .table('products')
        .where('id', params.itemId)
        .select('name')
      
      session.flash({'status': name[0].name + ' is now inactive'})
      return response.redirect('back')
    }

    async showItem ({ params, response, session }) {
      const update = await Database
        .table('products')
        .where('id', params.itemId)
        .update('active', true)
      const name = await Database
        .table('products')
        .where('id', params.itemId)
        .select('name')

      
      session.flash({'status': name[0].name + ' is now active'})
      return response.redirect('back')
    }


    async updateItem ({ view, request, response, session }) {
      const req = request.all()
      const { name, price, label, category } = req.product
      var { macros, variations } = req.product
      const { description } = req
      const skus = req.product_id

  
        const update = await Database
        .table('products')
        .where('id', req.id)
        .update({
          name,
          price,
          label,
          category,
          macros,
          variations,
          description,
          skus
        })


      if (typeof update === 'number') {
        session.flash({'status': 'Product updated successfully'})
      } else {
        session.flash({'error': 'There was a problem updating this product.  Please try again'})
      }
      return response.redirect('back')

      // try {
      //   const obj = request.all()
      //   delete obj['']

      //   var prod = obj[Object.keys(obj)[0]]

      //   prod.parent_id = prod.name.toLowerCase().replace(/ /g, '_')
      //   var parent = prod.parent_id.replace(/ /g, '_')
      //   parent = parent.replace(/,|&|'|"|\*|\(|\)/g, '')
      //   parent = parent.toLowerCase()
      //   // This is incorrectly trying to update the main product using the primary sku
      //   // Need to correct this so that it attempts to update the parent product.
      //   stripe.products.update(parent, {
      //     name: prod.name,
      //     description: prod.description,
      //     active: prod.status,
      //     metadata: {
      //       primary_category: prod.primary_category,
      //       active: prod.status

      //     }
      //   })
      //   for (var i = 0; i < Object.keys(obj).length; i++) {
      //     var sku = obj[Object.keys(obj)[i]]     

      //     //Build our sku id based on parent id and size variation
      //     var id = sku.parent + '_' + sku.size.replace(/,|&|'|"|\*|\(|\)/g, '')

      //     stripe.skus.update(id, {
      //       price: sku.price,
      //       image: sku.primary_img,
      //       metadata: {
      //         primary_category: sku.primary_category,
      //         name: sku.name,
      //         description: sku.description,
      //         primary_category: sku.category,
      //         protein_type: sku.protein_type,
      //         size: sku.size,
      //         fats: sku.fats,
      //         carbs: sku.carbs,
      //         calories: sku.calories,
      //         proteins: sku.proteins,
      //         filters: sku.filters
      //       }
      //     });
      //   }
      
      //   await this.updateItems()
        
      //   return response.send({status: 'success'})
      // } catch(e) {
      //   return response.send('error')
      // }

    }

    async showCheckout ({ view, session, auth, response }) {

      // Fetch our menu object containing items, filters, categories, etc...

      if (auth.user) { // If the user already has an account, load their fulfillment preferences

        var user = {}
        var store = await Database 
          .table('locations')
          .select('*')
          .where('id', auth.user.pickup_location)
  
        var stripeDetails = await stripe.customers.retrieve(auth.user.stripe_id)
        var orders = await stripe.orders.list({limit: 1, customer: auth.user.stripe_id})

        user.fulfillment_method = auth.user.fulfillment_method
        user.fulfillment_day = auth.user.fulfillment_day
        if (user.fulfillment_method == 'pickup' && auth.user.pickup_location != null) {
          store[0].desc = store[0].name
          user.pickupLocation = store[0]
          user.pickupLocation.desc = user.pickupLocation.name
        } else {
          user.fulfillment_method = 'delivery'
        }
        
        // return response.send(orders)
        if (orders.data.length != 0) {
          return view.render('menu.checkout', {stripe_pk, user, billing: stripeDetails, shipping: orders.data[0].shipping.address, disableModal: true})

        } else {
          return view.render('menu.checkout', {stripe_pk, user, billing: stripeDetails, shipping: '', disableModal: true})

        }

      } // If we reach this condition, it means the user is not logged in.  Just show them the menu
        // and we will collect their details before order is placed.
        return view.render('menu.checkout', {stripe_pk, disableModal: true})
    }

}

module.exports = ItemController