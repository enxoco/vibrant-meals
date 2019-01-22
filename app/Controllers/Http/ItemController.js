'use strict'

const Database = use('Database')
const Helpers = use('Helpers')
const Drive = use('Drive')
const stripe = require('stripe')('sk_test_ZmWaFEiBn0H63gNmfCacBolp')
const fetchMenu = use('App/Controllers/Helpers/FetchMenu')
const nextFulfillment = use('App/Controllers/Helpers/FetchNextFulfillment')
const showDeliveryOptions = use('App/Controllers/Helpers/FetchDeliveryOptions')

var cartCur = []

class ItemController {

  /**
   * 
   * These are admin related functions for managing menus on the item
   * 
   */
    async hideItem ({ params, response }) {
      const id = params.itemId

      const visible = await Database
        .table('items')
        .select('is_visible')
        .where('id', id)
        .first()

      if (visible.is_visible == 1) {
        const success = await Database
        .table('items')
        .update('is_visible', '0')
        .where('id', id)

      } else {
        const success = await Database
        .table('items')
        .update('is_visible', 1)
        .where('id', id)

      }

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
    
    async updateItem ({ view, request, response, params, session }) {

        const obj = request.all()
        const allFilters = await Database
          .table('item_filters')
          .select('name', 'id')

        const allCategories = await Database
          .table('item_categories')
          .select('desc', 'id')

        for ( var i = 0; i < allFilters.length; i++) {
          var filter = allFilters[i].name
          if (obj[filter] == 'on') {
            const db_update = await Database
            .raw('INSERT IGNORE INTO items_in_filters (item_id, filter_id) VALUES('+ params.itemId +','+ allFilters[i].id+')')
          } else if (!obj[filter]) {
            const db_update = await Database
            .raw('DELETE FROM items_in_filters WHERE item_id = ' + parseInt(params.itemId) + ' AND filter_id = ' + allFilters[i].id )
          }
        }

        for ( var i = 0; i < allCategories.length; i++) {
          var cat = allCategories[i].desc
          if (obj[cat] == 'on') {
            const db_update = await Database
            .raw('INSERT IGNORE INTO items_in_categories (item_id, category_id) VALUES('+ params.itemId +','+ allCategories[i].id+')')
          } else if (!obj[cat]) {
            const db_update = await Database
            .raw('DELETE FROM items_in_categories WHERE item_id = ' + parseInt(params.itemId) + ' AND category_id = ' + allCategories[i].id )
          }
        }

    
        const profilePic = request.file('item-image')
        const altImage = request.file('item-image-alt')
    
        if (profilePic) {
          let name = `item-${params.itemId}_${profilePic.clientName}`
          await profilePic.move(Helpers.publicPath('uploads'), {
            name: name,
            overwrite:true
          })
          var img_url = `uploads/${name}`
          await Database
          .table('items')
          .where('id', params.itemId)
          .update({
            img_url: img_url
          })
        }
    
        if (altImage) {
          let name = `item-${params.itemId}_${altImage.clientName}`
          await altImage.move(Helpers.publicPath('uploads'), {
            name: name,
            overwrite:true
          })
          var alt_img_url = `uploads/${name}`
          await Database
          .table('items')
          .where('id', params.itemId)
          .update({
            alt_img_url: alt_img_url
          })
        }
        
          var sugar = null
          var sodium = null

          if(obj.carbs) {
            var carbs = obj.carbs
          }
          if(obj.fat) {
           var fat = obj.fat
          }
          if(obj.calories) {
            var calories = obj.calories
          }
          if(obj.protein) {
            var protein = obj.protein
          }
      
          if(obj.sugar) {
            var sugar = obj.sugar
          }
          if(obj.sodium) {
            var sodium = obj.sodium
          }
      
          var eightySixCount = null
      
          if(obj.eightySixCount) {
            var eightySixCount = obj.eightySixCount
          }
          try {
            const success = await Database
            .table('items')
            .where('id', params.itemId)
            .update({
              name: obj.name,
              price: obj.price,
              description: obj.description,
              calories: calories,
              fats: fat,
              carbs: carbs,
              protein: protein,
              eightySixCount: eightySixCount,
              sugar: sugar,
              sodium: sodium,
              sku: obj.sku
            })
            session.flash({ status: 'Updated Successfully' })
            return response.redirect('back')
          } catch (error) {
            return response.send(`Error ${error}`)
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
    
    async addItem ({ view, request, response, params, session }) {
      const obj = request.all()
      const profilePic = request.file('item-image')
        if (profilePic) {
          try {
            let name = `item-${params.itemId}_${profilePic.clientName}`
            await profilePic.move(Helpers.publicPath('uploads'), {
              name: name,
              overwrite:true
            })
            var img_url = `uploads/${name}`
          } catch (error) {
            session.flash({error: `Sorry, something went wrong: ${error}`})
            return response.redirect('back')
          }
        }
      
        var sugar = null
        var sodium = null
        if(obj.is_keto) {
          var is_keto = 1
        }
        if(obj.is_whole30) {
          var is_whole30 = 1
        }
        if(obj.is_paleo) {
          var is_paleo = 1
        }
        if(obj.is_lowCarb) {
          var is_lowCarb = 1
        }
        if(obj.carbs) {
          var carbs = obj.carbs
        }
        if(obj.fat) {
         var fat = obj.fat
        }
        if(obj.calories) {
          var calories = obj.calories
        }
        if(obj.protein) {
          var protein = obj.protein
        }
    
        if(obj.sugar) {
          var sugar = obj.sugar
        }
        if(obj.sodium) {
          var sodium = obj.sodium
        }
    
        var eightySixCount = null
    
        if(obj.eightySixCount) {
          var eightySixCount = obj.eightySixCount
        }
    
        
        try {
          const user = await Database
            .table('users')
            .select('name', 'stripe_id')
            .where('id', session.get('adonis-auth'))
          // Create an item in Stripe
          // const stripeObj = await stripe.products.create({
          //   name: obj.name,
          //   type: 'service',
          //   attributes: ['size', 'gender']
          // });
          
          // Create a plan in Stripe
          // Stripe expects an int for the price field so we need to convert to a string
          // then check to see how many digits we have and add a zero to the end if we
          // only have two.  For instance, if someone types in 9.5, the below code turns
          // that into a string of 950 which is then converted to an int and sent to Stripe
    
          // I think that what we actually need to do is create a product and then create a
          // sku associated with that product.  Then we can create an order with the skus.
          var price = String(obj.price).replace(".", "")
          if(price.length == 2) {
            price += '0'
          }

      
          // Need to first create a product, then create a sku for that product.
          const product = await stripe.products.create({
            name: obj.name,
            type: 'good',
            description: obj.description,
          });
          console.log(product.id)
          if (obj.quantity) {
            const sku = await stripe.skus.create({
              product: product.id,
              price: parseInt(price),
              currency: 'usd',
              id: obj.sku,
              inventory: {type: 'finite', quantity: obj.quantity}
            });
          } else {
            const sku = await stripe.skus.create({
              product: product.id,
              price: parseInt(price),
              currency: 'usd',
              id: obj.sku,
              inventory: {type: 'infinite'}
            });
          }


          // Instead of creating a plan, we actually need to create a product.
          // const plan = await stripe.plans.create({
          //   amount: parseInt(price),
          //   interval: "month",
          //   product: {
          //     name: obj.name
          //   },
          //   currency: "usd",
          // });


          // Create a subscription in Stripe
          // stripe.subscriptions.create({
          //   customer: user[0].stripe_id,
          //   items: [
          //     {
          //       plan: plan.id,
          //     },
          //   ]
          // });
          const success = await Database
          .table('items')
          .insert({
            name: obj.name,
            price: obj.price,
            sku: obj.sku,
            description: obj.description,
            img_url: img_url,
            calories: calories,
            fats: fat,
            carbs: carbs,
            protein: protein,
            eightySixCount: eightySixCount,
            sugar: sugar,
            sodium: sodium,
            stripe_id: obj.sku
          })

          const allFilters = await Database
          .table('item_filters')
          .select('name', 'id')

        const allCategories = await Database
          .table('item_categories')
          .select('desc', 'id')


        // TODO - Filter updates are working per the below code.  Still need to implement working code for category updates.
        for ( var i = 0; i < allFilters.length; i++) {
          var filter = allFilters[i].name
          if (obj[filter] == 'on') {
            const db_update = await Database
            .raw(`INSERT IGNORE INTO items_in_filters (item_id, filter_id) VALUES(${success}, ${allFilters[i].id})`)
          } else if (!obj[filter]) {
            const db_update = await Database
            .raw(`DELETE FROM items_in_filters WHERE item_id = ${parseInt(success)} AND filter_id = ${allFilters[i].id}`)
          }
        }

        for ( var i = 0; i < allCategories.length; i++) {
          var filter = allCategories[i].desc
          if (obj[filter] == 'on') {
            const db_update = await Database
            .raw(`INSERT IGNORE INTO items_in_categories (item_id, category_id) VALUES(${success}, ${allCategories[i].id})`)
          } else if (!obj[filter]) {
            const db_update = await Database
            .raw(`DELETE FROM items_in_categories WHERE item_id = ${parseInt(success)} AND category_id = ${allCategories[i].id} `)
          }
        }
        return view.render('edit-item', {item: obj, categories: allCategories, all_filters: allFilters})
    
        } catch (error) {
          return response.send(`Error ${error}`)
        }
    
    }

    async addToCart ({ request, session, response }) {
        var form = request.all()
        var cart = session.get('cartItem')
        var cartCount = session.get('cartCount') 
        if (cartCount) {
          cartCount += 1
          session.put('cartCount', cartCount)
        } else {
          session.put('cartCount', 1)
        }
        if (cart) { // Check to see if there are items in the cart
          
            cartCur = cart // If we already have items in the cart, set that the contents of the cartItem session key to the cartCur array
            for (var i = 0; i < cartCur.length; i++) {
                if (cartCur[i].id == form.id) {

                    var quantity = parseInt(cartCur[i].quantity)

                    cartCur[i].quantity = parseInt(cartCur[i].quantity) + 1 // Make sure we convert our quanity to an integer otherwise we will just add numbers onto a string
                    session.put('cartItem', cartCur)
                    await Database
                    .table('items')
                    .decrement('eightySixCount', 1)
                    .where('id', cartCur[i].id)
                    return response.redirect('back', true)
                }
            }

            cartCur.push(form)// Push our new item onto the end of the cartCur array

        } else {
            for (var i = 0; i < cartCur.length; i++) {
                if (cartCur[i].id == form.id) {
                    form.quantity += 1

                }
            }
            cartCur.push(form)// Nothing previously in the cart so simply add our current item to the array
        }
        var totalPrice = 0
        for (var i = 0; i < cartCur.length; i++) {
            totalPrice += cartCur[0].price
        }
        // Set the cartItem session key to the contents of our cartCur array
        session.put('cartItem', cartCur)
        return response.redirect('back')
    }

    async clearCart ({ response, session}) {
        session.put('cartItem', '') // Clear the cart from the session
        cartCur = [] // Make sure to reset the cart array as it may contain old cart items
        return response.redirect('back')
    }

    // Reduce quantity of items in cart
    async subCart ({ session, response, params }) {
        var cart = session.get('cartItem')
        await Database
        .table('items')
        .increment('eightySixCount', 1)
        .where('id', cart[params.cartPos].id)

        cart[params.cartPos].quantity = parseInt(cart[params.cartPos].quantity) - 1 
        return response.redirect('back')

    }
    
    async removeItem ({ session, response, params }) {
        var cart = session.get('cartItem')
        cartCur = []
        for (var i = 0; i < cart.length; i++) {
            if (i != params.cartPos) {

            } 
        }

        session.put('cartItem', cartCur)
        return response.redirect('back')
    }

    async showMenu ({ view, session, response }) {
      // Setup our cart items variable
      var cart = session.get('cartItem')

      // Get our cart count if available.  This is used for basic analytics
      // Used mainly to track whether we should show the registration modal
      var cartCount = session.get('cartCount')

      // Fetch our menu object containing items, filters, categories, etc...
      const menu_items = await fetchMenu()

      if (session.get('adonis_auth')) { // If the user already has an account, load their fulfillment preferences

        const user = await Database
        .table('users')
        .select('id', 'name', 'email', 'zip', 'fulfillment_method', 'is_guest', 'fulfillment_day', 'pickup_location')
        .where('id', session.get('adonis_auth'))  
  
        const store = await Database
          .select('*')
          .from('locations')
          .where('id', session.get('locationId'))   
        const nextAvalDate = await nextFulfillment(user[0].fulfillment_day)
        session.put('fulfillment_day', nextAvalDate)
        const deliverable = await showDeliveryOptions(user.zip)
        
        return view.render('menu.items', {cart, categories: menu_items.categories, user, items: menu_items.items, nextAvalDate, store, hasAccount: true, fulMethod: user[0].fulfillment_method, deliverable})

      } // If we reach this condition, it means the user is not logged in.  Just show them the menu
        // and we will collect their details before order is placed.
        return view.render('menu.items', {cart, categories: menu_items.categories, items: menu_items.items, cartCount, hasAccount: false})
    }


    /**
     * 
     * This function is used to list the items in a particular category 
     * 
     * Route /items/category/:cat_id
     *  |
     * \ /
     * 
     */
    async list ({ params, view, session, response }) { 
      var cat_ids = params.cat_id
      var cart = session.get('cartItem')
      
      const subquery = Database
        .from('items_in_categories')
        .where('category_id', cat_ids)
        .select('item_id')
    
      const items = await Database
        .from('items')
        .select('*')
        .whereIn('id', subquery)

      const categories = await Database
        .table('item_categories')
        .distinct('desc', 'id')
      
      return view.render('menu.items', {items, categories: categories, cart})
    }
}

module.exports = ItemController
