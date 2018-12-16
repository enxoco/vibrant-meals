'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemCategoriesSchema extends Schema {
  up () {
    this.createIfNotExists('item_categories', (table) => {
      table.increments('id')
      table.string('desc').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('item_categories')
  }
}

module.exports = ItemCategoriesSchema

