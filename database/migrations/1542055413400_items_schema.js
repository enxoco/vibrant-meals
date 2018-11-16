'use strict'

const Schema = use('Schema')

class ItemsSchema extends Schema {
  up () {
    this.create('items', (table) => {
      table.increments()
      table.string('name').nullable()
      table.string('sku').nullable()
      table.string('description').nullable()
      table.string('img_url').nullable()
      table.decimal('price').nullable()
      table.integer('eightySixCount').nullable()
      table.integer('calories').nullable().defaultsTo(0)
      table.integer('fats').nullable().defaultsTo(0)
      table.integer('carbs').nullable().defaultsTo(0)
      table.integer('protein').nullable().defaultsTo(0)
      table.integer('sodium').nullable().defaultsTo(0)
      table.integer('sugar').nullable().defaultsTo(0)
      table.boolean('is_keto').nullable().defaultsTo(0)
      table.boolean('is_whole30').nullable().defaultsTo(0)
      table.boolean('is_lowCarb').nullable().defaultsTo(0)
      table.boolean('is_breakfast').nullable().defaultsTo(0)
      table.boolean('is_paleo').nullable().defaultsTo(0)
      table.boolean('is_visible').nullable().defaultsTo(1)

      table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }
}

module.exports = ItemsSchema
