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
    await Database
      .table('items')
      .insert([
        {
          id: 1,
          name: 'Angus Burger',
          sku: 'aburger',
          img_url: 'https://res.cloudinary.com/themurphs/image/upload/v1542120686/Vibrant%20Meals/angusBurger.jpg',
          description: 'Home-made Angus beef patty with kale, tomatoes, mushrooms, sweet potato fries and a side of our house made chipotle mayo sauce.',
          price: 10,
          eightySixCount: 12,
          calories: 610,
          fats: 36,
          carbs: 32,
          protein: 49,
          is_keto: 1,
          is_paleo: 1
        },
        {
          id: 2,
          name: 'BBQ Pulled Pork',
          sku: 'bbq-pulled-pork',
          img_url: 'https://res.cloudinary.com/themurphs/image/upload/v1542120789/Vibrant%20Meals/BBQ_Pulled_Pork.jpg',
          description: 'For those southern foodies! Pulled pork, roasted whole brussels sprouts, and mashed sweet potato with a handcrafted BBQ sauce.',
          price: 9.50,
          eightySixCount: 12,
          calories: 430,
          fats: 17,
          carbs: 35,
          protein: 35,
          is_paleo: 1
        },
      ])
    
  }
}

module.exports = ItemSeeder
