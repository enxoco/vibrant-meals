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
          sku: 'angus-burger',
          img_url: 'images/uploads/angusBurger.jpeg',
          description: 'Home-made Angus beef patty with kale, tomatoes, mushrooms, sweet potato fries and a side of our house made chipotle mayo sauce.',
          price: 9.75,
          eightySixCount: 12,
          calories: 610,
          fats: 36,
          carbs: 32,
          protein: 49,
          is_keto: 1,
          is_paleo: 1,
          stripe_id: 'plan_E6HsPmOWPdvQTO'
        },
        {
          id: 2,
          name: 'BBQ Pulled Pork',
          sku: 'bbq-pulled-pork',
          img_url: 'images/uploads/BBQ+Pulled+Pork.jpeg',
          description: 'For those southern foodies! Pulled pork, roasted whole brussels sprouts, and mashed sweet potato with a handcrafted BBQ sauce.',
          price: 9.50,
          eightySixCount: 12,
          calories: 430,
          fats: 17,
          carbs: 35,
          protein: 35,
          is_paleo: 1,
          stripe_id: 'plan_E6HtqAm4HhoNih'
        },
        {
          id: 3,
          name: 'Spaghetti Squash Meatball',
          sku: 'spaghetti-squash-meatball',
          img_url: 'https://static1.squarespace.com/static/572361987c65e48584ee75e7/587ea50ff7e0abac0d8cda55/5a9dfa93c83025ca5dbac982/1520302758007/Spaghetti+Squash+Meatball_mini.JPG?format=2500w',
          description: 'Roasted spaghetti squash, turkey meatballs, garlic, tomatoes, basil, spices all in our homemade marinara sauce.',
          price: 9.75,
          eightySixCount: 12,
          calories: 310,
          fats: 13,
          carbs: 15,
          protein: 35,
          is_paleo: 1,
          is_lowCarb: 1,
          stripe_id: 'plan_E6HucxC1w27Wl3'
        },
        {
          id: 4,
          name: 'Chorizo Hemp Seed Bowl',
          sku: 'chorizo-hemp-seed-bowl',
          img_url: 'https://static1.squarespace.com/static/572361987c65e48584ee75e7/587ea50ff7e0abac0d8cda55/5ba26299758d468035a43a5b/1537368851135/Chorizo+Hemp+Seed+Bowl_mini.JPG?format=2500w',
          description: 'Scrambled egg whites, kale, sweet potato, pork chorizo, red bell peppers, onions and a dash of hemp seed. ',
          price: 7.50,
          eightySixCount: 12,
          calories: 420,
          fats: 19,
          carbs: 36,
          protein: 27,
          is_whole30: 1,
          stripe_id: 'plan_E6HvbgcPJEWM7y'
        },
      ])
    
  }
}

module.exports = ItemSeeder
