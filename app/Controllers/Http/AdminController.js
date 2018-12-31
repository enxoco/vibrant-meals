'use strict'
const Database = use('Database')
class AdminController {

    async showItems ({ view }) {
        const items = await Database
            .table('items')
        const categories = await Database
            .table('item_categories')
            .distinct('desc', 'id')

        return view.render('admin.items', {categories: categories, items: items})
    }

    async showCategories ({ view }) {
        const categories = await Database
            .table('item_categories')
            .distinct('desc', 'id')

        return view.render('admin.categories.edit', {categories: categories})
    }
}

module.exports = AdminController
