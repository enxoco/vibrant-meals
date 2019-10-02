'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemFiltersSchema extends Schema {
  up () {
    this.create('item_filters', (table) => {
      table.increments()
      table.string('name')
      table.timestamps()
    })
  }

  down () {
    this.drop('item_filters')
  }
}

module.exports = ItemFiltersSchema
