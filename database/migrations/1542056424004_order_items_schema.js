'use strict'
/*
*
*  This table will hold the inviduals items that are tied to an order
*  Each item will have an itemId tieing it to the items table as well
*  as an orderId tieing it to an order.  In this way we can query this
*  table to find all the items that are attached to a specific order
*
*/
const Schema = use('Schema')

class OrderItemsSchema extends Schema {
  up () {
    this.create('order_items', (table) => {
      table.increments()
      table.integer('orderId')// Should be linked to orders_id
      table.integer('itemId')// Should be linked to items_id
      table.integer('quantity')// Number of times this item is on this order
      table.timestamps()
    })
  }

  down () {
    this.drop('order_items')
  }
}

module.exports = OrderItemsSchema
