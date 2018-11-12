'use strict'

const Database = use('Database')
/*
|--------------------------------------------------------------------------
| ItemSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class ItemSeeder {
  async run () {
    Database
      .table('items')
      .insert(
        {
          name: 'Angus Burger',
          sku: 'aburger',
          description: 'Home-made Angus beef patty with kale, tomatoes, mushrooms, sweet potato fries and a side of our house made chipotle mayo sauce.',
          price: 10,
          eightySixCount: 12,
          calories: 610,
          fats: 36,
          carbs: 32,
          protein: 49,
          is_keto: 1

        }
        )
    
  }
}

module.exports = ItemSeeder
