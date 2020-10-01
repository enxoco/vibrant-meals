'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ItemCategory extends Model {
    items () {
        return this.belongsToMany('App/Models/Item', 'id', 'item_categories.category_id')
    }
}

module.exports = ItemCategory
