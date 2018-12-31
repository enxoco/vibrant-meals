'use strict'

/*
|--------------------------------------------------------------------------
| ItemCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class ItemCategorySeeder {
  async run () {
    await Database
      .table('item_categories')
      .insert([
        {
          id: 1,
          desc: 'Breakfast'
        },
        {
          id: 2,
          desc: 'Elite'
        },
        {
          id: 3,
          desc: 'Everyday'
        },
        {
          id: 4,
          desc: 'Performance'
        }
      ])
  }
}

module.exports = ItemCategorySeeder
