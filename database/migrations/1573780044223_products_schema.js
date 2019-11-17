'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductsSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.int('active')
      table.text('description')
      table.text('metadata')
      table.string('name')
      table.string('skus')
      table.text('images')
      table.text('macros')
      table.text('variations')
      table.string('category')
      table.string('label')
      table.int('price')
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductsSchema
