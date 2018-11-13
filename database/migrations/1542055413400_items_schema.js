'use strict'

const Schema = use('Schema')

class ItemsSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.string('name').nullable()
      table.string('sku').nullable()
      table.string('description').nullable()
      table.integer('price').nullable()
      table.integer('eightySixCount').nullable()
      table.integer('calories').nullable()
      table.integer('fats').nullable()
      table.integer('carbs').nullable()
      table.integer('protein').nullable()
      table.boolean('is_keto').nullable()
      table.boolean('is_whole30').nullable()
      table.boolean('is_lowCarb').nullable()
      table.boolean('is_paleo').nullable()

      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemsSchema
