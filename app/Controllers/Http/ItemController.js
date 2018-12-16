'use strict'

const Database = use('Database')
const Item = use('App/Models/Item')
const Categories = use('App/Models/ItemCategory')

class ItemController {

    async showMenu ({ response, params, view }) {
        const items = await Item.all()
        
        return view.render('menu.items')
    }
    async list ({ response, params }) {

        var itemList = []
        var cat_ids = params.cat_id.split(',')
        console.log(cat_ids)
        for (var i = 0; i < cat_ids.length; i++) {

            const subquery = Database
            .from('items_in_categories')
            .where('category_id', cat_ids[i])
            .select('item_id')
    
            const item = await Database
            .from('items')
            .select('name', 'price', 'sku')
            .whereIn('id', subquery)
            console.log(item[0].name)
            if (item[i].name) {
                itemList.push({item})
            }

        }

        return response.send(itemList)
    }
}

module.exports = ItemController
