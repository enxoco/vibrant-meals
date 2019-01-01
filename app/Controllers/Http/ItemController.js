'use strict'

const Database = use('Database')
const Categories = use('App/Models/ItemCategory')
const ItemCategory = use('App/Models/ItemCategory')
const Item = use('App/Models/Item')
const users = make('App/Services/UserService')
const User = use('App/Models/User')
const Helpers = use('Helpers')
const Env = use('Env')

const stripe = require('stripe')('sk_test_ZmWaFEiBn0H63gNmfCacBolp')

var cartCur = []

class ItemController {

    async addItemView ({ request, response, view }) {
        const categories = await Database
            .from('item_categories')
            .select('id', 'desc')
            
        return view.render('add-item', {categories})
    }
    async updateItem ({ view, request, response, params, session }) {

        const obj = request.all()
        const allFilters = await Database
          .table('item_filters')
          .select('name', 'id')

        // TODO - Filter updates are working per the below code.  Still need to implement working code for category updates.
        for ( var i = 0; i < allFilters.length; i++) {
          var filter = allFilters[i].name
          if (obj[filter] == 'on') {
            console.log(params.itemId, allFilters[i].id)
            const db_update = await Database
            .raw('INSERT IGNORE INTO items_in_filters (item_id, filter_id) VALUES('+ params.itemId +','+ allFilters[i].id+')')
          } else if (!obj[filter]) {
            const db_update = await Database
            .raw('DELETE FROM items_in_filters WHERE item_id = ' + parseInt(params.itemId) + ' AND filter_id = ' + allFilters[i].id )
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
              sodium: sodium
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
                        console.log('match')
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
    
        // var imgFile = await profilePic.moveAll('public/images/uploads/')
    
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
          const plan = await stripe.plans.create({
            amount: parseInt(price),
            interval: "month",
            product: {
              name: obj.name
            },
            currency: "usd",
          });
          console.log(`user ${JSON.stringify(user)}`)
          // Create a subscription in Stripe
          stripe.subscriptions.create({
            customer: user[0].stripe_id,
            items: [
              {
                plan: plan.id,
              },
            ]
          });
          const success = await Database
          .table('items')
          .insert({
            name: obj.name,
            price: obj.price,
            sku: obj.sku,
            description: obj.description,
            img_url: img_url,
            is_keto: is_keto,
            is_lowCarb: is_lowCarb,
            is_paleo: is_paleo,
            is_whole30: is_whole30,
            calories: calories,
            fats: fat,
            carbs: carbs,
            protein: protein,
            eightySixCount: eightySixCount,
            sugar: sugar,
            sodium: sodium,
            stripe_id: plan.id
          })
          return response.send({newId: success, item: obj})
    
        } catch (error) {
          return response.send(`Error ${error}`)
        }
    
      }

    async addToCart ({ request, session, response }) {
        var form = request.all()
        var cart = session.get('cartItem') 
        if (cart) { // Check to see if there are items in the cart
            cartCur = cart // If we already have items in the cart, set that the contents of the cartItem session key to the cartCur array
            
            for (var i = 0; i < cartCur.length; i++) {
                if (cartCur[i].id == form.id) {
                    var quantity = parseInt(cartCur[i].quantity)

                    cartCur[i].quantity = parseInt(cartCur[i].quantity) + 1 // Make sure we convert our quanity to an integer otherwise we will just add numbers onto a string
                    session.put('cartItem', cartCur)
                    return response.redirect('back')
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

    async subCart ({ session, response, params }) {
        var cart = session.get('cartItem')
        cart[params.cartPos].quantity = parseInt(cart[params.cartPos].quantity) - 1 
        return response.redirect('back')

    }
    
    async removeItem ({ session, response, params }) {
        var cart = session.get('cartItem')
        cartCur = []
        for (var i = 0; i < cart.length; i++) {
            if (i != params.cartPos) {
                cartCur.push(cart[i])
            } 
        }

        session.put('cartItem', cartCur)
        return response.redirect('back')
    }

    async showMenu ({ view, session }) {
        const items = await Database
            .table('items')
        const categories = await Database
            .table('item_categories')
            .distinct('desc', 'id')

        var cart = session.get('cartItem')
        return view.render('menu.items', {cart, categories: categories, items: items, cart: cart})
    }
    async list ({ params, view, session }) {

        var cat_ids = params.cat_id

            const subquery = Database
            .from('items_in_categories')
            .where('category_id', cat_ids)
            .select('item_id')
    
            const items = await Database
            .from('items')
            .select('id', 'name', 'price', 'sku', 'img_url')
            .whereIn('id', subquery)

        
        const categories = await Database
        .table('item_categories')
        .distinct('desc', 'id')
        var cart = session.get('cartItem')


        return view.render('menu.items', {items, categories: categories, cart})
    }
}

module.exports = ItemController
