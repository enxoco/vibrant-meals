'use strict'



const Database = use('Database')
class CategoryController {

    async update ({ request, response, view, }) {
        const cat = request.all()
        const update = await Database
            .table('item_categories')
            .where('id', cat.id)
            .update('desc', cat.name)
        return response.send(update)

    }

    async listItems ({ request, response, view, }) {
        const cat = request.all()
        const list = Database
            .from('items_in_categories')
            .select('item_id as id')
            .where('category_id', cat.id)
            

        const items = await Database
            .from('items')
            .where('id', list)
            .select('name')

        return response.send(items)

    }

}

module.exports = CategoryController
