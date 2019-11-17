'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.string('stripe_id')
      table.int('customer_id')
      table.text('items')
      table.int('monday')
      table.int('thursday')
      table.string('fulfillment_date')
      table.string('fulfillment_method')
      table.string('charge_id')
      table.string('payment_status')
      table.string('order_status')
      table.string('allergy_info')
      table.string('delivery_info')
      table.int('orderId')
      table.string('fulfillment_day')
      table.int('user_id')
      table.string('order_amount')
      table.string('created_at')
      table.string('updated_at')
      table.string('cancelled_at')
      table.text('shipping_info')
      table.text('billing_info')
      table.int('creation_week')
      table.int('fulfillment_week')
      table.string('name')
      table.string('email')
      table.string('location')
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
