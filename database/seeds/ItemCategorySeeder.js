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
          desc: 'Everyday',
          color: '#AAD0AE'
        },
        {
          id: 2,
          desc: 'Low Carb',
          color: '#FED39F'
        },
        {
          id: 3,
          desc: 'Performance',
          color: '#D86A6A'
        },
        {
          id: 4,
          desc: 'Plant Based',
          color: '#D4C3DF'
        },
        {
          id: 5,
          desc: 'Breakfast',
          color: '#F7E393'
        }
      ])
  }
}

module.exports = ItemCategorySeeder
