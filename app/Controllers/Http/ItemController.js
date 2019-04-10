'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
stripe.setApiVersion('2019-03-14');

const fetchMenu = use('App/Controllers/Helpers/FetchMenu')



var cartCur = []

class ItemController {

  async updateItems() {
    const path = Helpers.appRoot()

    try {
      //Beware Stripe api defaults to limit of 10 products when doing a listing.
      var products = await stripe.products.list({limit:100000})
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

  async listItems ({view, response, auth, request}) {

    const path = Helpers.appRoot()
    var prod = await Drive.get(`${path}/products.json`, 'utf-8')
    prod = JSON.parse(prod)
    var categories = []
    var filters = []
    for (var i = 0; i < prod.length; i++) {
      categories.push(prod[i].metadata.primary_category)
    }

    var uniq = [ ...new Set(categories) ];

    if (auth.user) {
      var user = {}
      if (auth.user.fulfillment_method == 'pickup') {
        var store = await Database 
        .table('locations')
        .select('*')
        .where('id', auth.user.pickup_location)
        store[0].desc = store[0].name
        user.pickupLocation = store[0]
      }


      user.fulfillment_method = auth.user.fulfillment_method
      user.fulfillment_day = auth.user.fulfillment_day
      return view.render('menu.menu-new', {items: prod, categories: uniq, user: user})
      
    } else {

      return view.render('menu.menu-new', {items: prod, categories: uniq})
    }

  }


  /* Show form for editing a current item */

  async listItemsAdmin ({view, response, params}) {

    var products = await stripe.products.retrieve( params.sku );
    var prod = products
      var sku = await stripe.skus.list(
        {product: prod.id}
      )
      prod.skus = sku
    
    return view.render('admin.items-edit', {prod})

  }

  /**
   * 
   * These are admin related functions for managing menus on the item
   * 
   */
    async hideItem ({ params, response }) {
      stripe.products.update(params.itemId, {active: false,})
      return response.redirect('back')
    }
    async showItem ({ params, response }) {
      stripe.products.update(params.itemId, {active: true,})
      return response.redirect('back')
    }

    async deleteItem ({ params }) {

      const imgUrl = await Database
        .table('items')
        .select('img_url', 'alt_img_url')
        .where('id', params.itemId)
      await Database
        .table('items_in_categories')
        .where('item_id', params.itemId)
        .del()

      await Database
        .table('items_in_filters')
        .where('item_id', params.itemId)
        .del()
      
      await Database
        .table('items')
        .where('id', params.itemId)
        .del()

      await Drive.delete('/uploads/' + imgUrl[0].img_url)
      await Drive.delete('/uploads/' + imgUrl[0].alt_img_url)
    }

    async updateItem ({ view, request, response }) {
      try {
        const obj = request.all()
        delete obj['']

        var prod = obj[Object.keys(obj)[0]]

        prod.parent_id = prod.name.toLowerCase().replace(/ /g, '_')
        // This is incorrectly trying to update the main product using the primary sku
        // Need to correct this so that it attempts to update the parent product.
        stripe.products.update(prod.parent_id, {
          name: prod.name,
          description: prod.description,
          metadata: {
            primary_category: prod.primary_category,

          }
        })
        for (var i = 0; i < Object.keys(obj).length; i++) {
          var sku = obj[Object.keys(obj)[i]]     

          //Build our sku id based on parent id and size variation
          var id = sku.parent_id + '_' + sku.size

          stripe.skus.update(id, {
            price: sku.price,
            image: sku.primary_img,
            metadata: {
              primary_category: sku.primary_category,
              name: sku.name,
              description: sku.description,
              primary_category: sku.category,
              protein_type: sku.protein_type,
              size: sku.size,
              fats: sku.fats,
              carbs: sku.carbs,
              calories: sku.calories,
              proteins: sku.proteins,
              filters: sku.filters
            }
          });
        }
      
        this.updateItems()
        
        return response.send({status: 'success'})
      } catch(e) {
        return response.send('error')
      }

    }

    async showCheckout ({ view, session, auth, response }) {

      // Fetch our menu object containing items, filters, categories, etc...
      const menu_items = await fetchMenu()

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
        if (user.fulfillment_method == 'pickup') {
          store[0].desc = store[0].name
          user.pickupLocation = store[0]
          user.pickupLocation.desc = user.pickupLocation.name
        }
        // return response.send(orders)
        return view.render('menu.checkout', {user, billing: stripeDetails, shipping: orders.data[0].shipping.address})

      } // If we reach this condition, it means the user is not logged in.  Just show them the menu
        // and we will collect their details before order is placed.
        return view.render('menu.checkout')
    }

}

module.exports = ItemController