'use strict'

/*
|--------------------------------------------------------------------------
| ItemFilterSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')
class ItemFilterSeeder {
  async run () {
    await Database
      .table('item_filters')
      .insert([
        {
          id: 1,
          name: 'Keto'
        },
        {
          id: 2,
          name: 'Low Carb'
        },
        {
          id: 3,
          name: 'Paleo'
        },
        {
          id: 4,
          name: 'Plant Based'
        }
      ])
  }
}

module.exports = ItemFilterSeeder
