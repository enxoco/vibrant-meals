'use strict'

const Schema = use('Schema')

class ItemModsSchema extends Schema {
  up () {
    this.create('item_mods', (table) => {
      table.increments()
      table.string('itemId')// Should be tied to items.id
      table.integer('price')// Will be added to the items total price
      table.string('name')
      table.string('description')
      table.string('mod_category') // Something like options or size.  
      table.timestamps()
    })
  }

  down () {
    this.drop('item_mods')
  }
}

module.exports = ItemModsSchema
