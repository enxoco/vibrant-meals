'use strict'

const Schema = use('Schema')

class ItemsSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.string('name').nullable()
      table.string('sku').nullable()
      table.string('description')
      table.integer('price')
      table.integer('eightySixCount')
      table.integer('calories')
      table.integer('fats')
      table.integer('carbs')
      table.integer('protein')
      table.boolean('is_keto')
      table.boolean('is_whole30')
      table.boolean('is_lowCarb')
      table.boolean('is_paleo')

      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemsSchema
