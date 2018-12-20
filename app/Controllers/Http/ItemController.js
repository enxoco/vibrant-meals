'use strict'

const Database = use('Database')
const Item = use('App/Models/Item')
const Categories = use('App/Models/ItemCategory')
var cartCur = []

class ItemController {

    async addToCart ({ request, session, response }) {
        var form = request.all()
        var cart = session.get('cartItem') 
        if (cart) { // Check to see if there are items in the cart
            cartCur = cart // If we already have items in the cart, set that the contents of the cartItem session key to the cartCur array
            cartCur.push(form)// Push our new item onto the end of the cartCur array
        } else {
            cartCur.push(form)// Nothing previously in the cart so simply add our current item to the array
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

    async showMenu ({ view, session }) {
        const items = await Database
            .table('items')
        const categories = await Database
            .table('item_categories')
            .distinct('desc', 'id')

        var cart = session.get('cartItem')
        return view.render('menu.items', {categories: categories, items: items, cart: cart})
    }
    async list ({ params, view }) {

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

        return view.render('menu.items', {items, categories: categories})
    }
}

module.exports = ItemController
