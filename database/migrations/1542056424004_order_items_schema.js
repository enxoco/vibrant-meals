'use strict'

const Schema = use('Schema')

class OrderItemsSchema extends Schema {
  up () {
    this.create('order_items', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('order_items')
  }
}

module.exports = OrderItemsSchema
