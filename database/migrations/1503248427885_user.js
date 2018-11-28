'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.createIfNotExists('users', table => {
      table.increments()
      table.string('email').nullable().unique()
      table.string('password', 72).nullable()
      table.string('name').nullable()
      table.string('username').nullable()
      table.string('avatar').nullable()
      table.string('gender').nullable()
      table.string('location').nullable()
      table.string('website').nullable()
      table.string('stripe_id').nullable()
      table.integer('zip').nullable()
      table.integer('is_guest').defaultsTo(1)
      table.string('fulfillment_method').nullable()
      table.string('fulfillment_day').nullable()
      table.integer('initial_order_completed').defaultsTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
