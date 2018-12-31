'use strict'

/*
|--------------------------------------------------------------------------
| ItemsInCategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class ItemsInCategorySeeder {
  async run () {
    await Database
      .table('items_in_categories')
      .insert([
        {
          id: 1,
          item_id: 4,
          category_id: 1
        }
      ])
  }
}

module.exports = ItemsInCategorySeeder
