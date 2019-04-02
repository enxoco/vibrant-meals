'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const Drive = use('Drive')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const fetchMenu = use('App/Controllers/Helpers/FetchMenu')



var cartCur = []

class ItemController {

  async listItems ({view, response, auth, request}) {

    var products = await stripe.products.list();

    var prod = products.data
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
 
    // var items = []
    // for (var i = 0; i < prod.length; i++) {
    //   var product = {'product':prod, skus:[]}
    //   for (var x = 0; x < prod[i].skus.data.length; x++){
    //     var sku = prod[i].skus.data[x]
    //     product.skus.push(sku)

    //   }
    //   items.push(product)
    // }
    // return items
    // // var prod = products.data
    // // // return prod
    // return response.send({items: prod, categories})
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

    async addItemView ({ view }) {
      const categories = await Database
        .from('item_categories')
        .select('id', 'desc')

      const allFilters = await Database
        .table('item_filters')
        .select('name', 'id')
            
      return view.render('add-item', {categories, all_filters: allFilters})
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
        console.log('trying to update')
        for (var i = 0; i < Object.keys(obj).length; i++) {
          var sku = obj[Object.keys(obj)[i]]          
          stripe.skus.update(sku.id, {
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
      

        return response.send({'status': 'success'})
      } catch(e) {
        return response.send('error')
      }

    }
    
    async editItem ({ view, request, response, params }) {
    
          
            const item = await Database
            .select('*')
            .from('items')
            .where('id', params.itemId)
            .limit(1)

            const categories = await Database
                .select('id', 'desc')
                .table('item_categories')
            const filters = await Database
                .select('id', 'name')
                .table('item_filters')

            
            const items_in_categories = await Database
                .select('item_categories.desc AS name')
                .table('items_in_categories')
                .innerJoin('item_categories', 'items_in_categories.category_id', 'item_categories.id')
                .where('items_in_categories.item_id', params.itemId)

                const itemFilters = await Database
                .select('item_filters.name AS name')
                .table('items_in_filters')
                .innerJoin('item_filters', 'items_in_filters.filter_id', 'item_filters.id')
                .where('items_in_filters.item_id', params.itemId)

                if(items_in_categories && items_in_categories.length != 0) {
                    item[0].category = items_in_categories[0].name

                }

                if (itemFilters && itemFilters.length != 0) {
                    item[0].filters = itemFilters
                }
                item[0].allFilters = filters

                // Check to make sure that our item has filters applied to it.
                // Because the filters are optional, we need to account for an item
                // that does not have any filters.
                if (item[0].filters && item[0].filters.length != 0) {
                  for (var i = 0; i < item[0].allFilters.length; i++) {
                    for ( var x = 0; x < item[0].filters.length; x++) {
                      if (item[0].allFilters[i].name == item[0].filters[x].name) { // If an item does have filters, add the filters to the item object
                        var filter = 'is_' + item[0].filters[x].name.toLowerCase().replace(/ /g, '_')
                        item[0][filter] = 1
                      }
                    }
                  }
                }
            return view.render('edit-item', {item: item[0], categories: categories, all_filters: filters})
    

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