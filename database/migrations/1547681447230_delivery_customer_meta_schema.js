'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DeliveryCustomerMetaSchema extends Schema {
  up () {
    this.create('delivery_customer_metas', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('street_addr')
      table.string('street_addr_2').nullable()
      table.string('city')
      table.string('zip')
      table.string('state')
      table.foreign('user_id').references('users.id')
      table.timestamps()
    })
  }

  down () {
    this.drop('delivery_customer_metas')
  }
}

module.exports = DeliveryCustomerMetaSchema
