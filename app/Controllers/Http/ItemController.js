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
