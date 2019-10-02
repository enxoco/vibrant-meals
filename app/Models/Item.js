'use strict'

const Model = use('Model')

class Item extends Model {
    categories () {
        return this
            .belongsToMany('App/Models/ItemCategory')
            .pivotTable('items_in_categories')
    }

}

module.exports = Item
