'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemsInFiltersSchema extends Schema {
  up () {
    this.create('items_in_filters', (table) => {
      table.increments()
      table.integer('item_id').unsigned()
      table.integer('filter_id').unsigned()
      table.foreign('item_id').references('items.id')
      table.foreign('filter_id').references('item_filters.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('items_in_filters')
  }
}

module.exports = ItemsInFiltersSchema
