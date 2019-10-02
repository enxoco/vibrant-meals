'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ItemCategoriesSchema extends Schema {
  up () {
    this.createIfNotExists('item_categories', (table) => {
      table.increments('id')
      table.text('desc').nullable()// This column needs to be changed to type text so that it can fit long descriptions
      table.string('color')
      table.timestamps()
    })
  }

  down () {
    this.drop('item_categories')
  }
}

module.exports = ItemCategoriesSchema

