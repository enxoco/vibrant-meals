'use strict'
const Database = use('Database')

/*
|--------------------------------------------------------------------------
| ProductImageSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class ProductImageSeeder {
  async run () {
    await Database
      .table('product_images')
      .insert([
        {
          id: 1,
          path: 'images/uploads/angusBurger.jpeg',
          item_id: 1
        },
        {
          id: 2,
          path: 'images/uploads/BBQ+Pulled+Pork.jpeg',
          item_id: 2
        },
        {
          id: 3,
          path: 'images/uploads/Spaghetti+Squash+Meatball_mini.jpeg',
          item_id: 3
        },
        {
          id: 4,
          path: 'images/uploads/Chorizo+Hemp+Seed+Bowl_mini.jpeg',
          item_id: 4
        },
        {
          id: 5,
          path: 'images/uploads/Chorizo+Hemp+Seed+Bowl_mini.jpeg',
          item_id: 4
        },
        ])
  }
}

module.exports = ProductImageSeeder
