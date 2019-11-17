'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LocationsSchema extends Schema {
  up () {
    this.create('locations', (table) => {
      table.increments()
      table.string('name')
      table.string('description')
      table.string('street_addr')
      table.string('street_addr_sec')
      table.string('city')
      table.string('state')
      table.int('zip')
      table.int('is_active')
      table.string('opens')
      table.string('closes')
      table.text('coordinates')
      table.string('location_type')
      table.timestamps()
    })
  }

  down () {
    this.drop('locations')
  }
}

module.exports = LocationsSchema
