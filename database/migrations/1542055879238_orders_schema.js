'use strict'

const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()// Order Id
      table.boolean('is_paid')// Financial Status
      table.string('paid_at')// Paid At
      table.string('fulfillment_status')// Fulfillment Status
      table.string('fulfillment_date')// Fulfilled At
      table.string('fulfillment_method')// Shipping Method
      table.integer('subtotal')// Subtotal
      table.integer('shipping')// Shipping
      table.integer('taxes')// Taxes
      table.integer('total')// Total
      table.string('order_id')// Coming from stripe
      table.integer('user_id')// To link orders to users


      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
