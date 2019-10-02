'use strict'
const Database = use('Database')


/*
|--------------------------------------------------------------------------
| LocationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class LocationSeeder {
  async run () {
    await Database
    .table('locations')
    .insert([
      {
        id: 1,
        name: 'Vibrant Meals Kitchen',
        street_addr: '601 Cherokee Blvd',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37405'
      },
      {
        id: 2,
        name: 'Chattanooga Functional Fitness',
        street_addr: '125 Cherokee Blvd',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37405',
        is_active: 1
      },
      {
        id: 3,
        name: 'Kyle House Fitness',
        street_addr: '525 West Main Street',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37402',
        is_active: 1

      },      
      {
        id: 4,
        name: 'Crossfit Anistemi',
        street_addr: '5806 Waterlevel Highway',
        city: 'Cleveland',
        state: 'TN',
        zip: '37323',
        is_active: 1

      },      {
        id: 5,
        name: 'Body By Hannah',
        street_addr: '282 Church St SE',
        city: 'Cleveland',
        state: 'TN',
        zip: '37311',
        is_active: 1
      },
    ])
  }
}

module.exports = LocationSeeder
