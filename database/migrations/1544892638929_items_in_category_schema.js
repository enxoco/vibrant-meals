'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemsInCategorySchema extends Schema {
  up () {
    this.create('items_in_categories', (table) => {
      table.increments()
      table.integer('item_id').unsigned()
      table.integer('category_id').unsigned()
      table.foreign('item_id').references('items.id')
      table.foreign('category_id').references('item_categories.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('items_in_categories')
  }
}

module.exports = ItemsInCategorySchema
