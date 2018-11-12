'use strict'

const Schema = use('Schema')

class OrdersSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrdersSchema
