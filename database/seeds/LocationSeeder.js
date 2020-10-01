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
        zip: '37405',
        opens: '8:00am',
        closes: '6:30pm',
        coordinates: '["-85.317076","35.068908"]',
        location_type: 'Retail'
      },
      {
        id: 2,
        name: 'Downtown YMCA',
        description: 'Downtown YMCA',
        street_addr: '301 West 6th Street	',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37402',
        opens: '10:00am',
        closes: '8:00pm',
        coordinates: '["-85.312839","35.049675"]',
        location_type: 'Pickup'
      },
      {
        id: 3,
        name: 'Kyle House Fitness',
        description: 'Kyle House Fitness',
        street_addr: '525 West Main Street',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37402',
        opens: '9:30am',
        closes: '2:30pm',
        coordinates: '["-85.3136527","35.0385917"]',
        location_type: 'Pickup'
      },
      {
        id: 4,
        name: 'Crossfit Brigade East',
        description: 'Crossfit Brigade East',
        street_addr: '8142 E Brainerd Rd',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37421',
        opens: '4:00pm',
        closes: '7:00pm',
        coordinates: '["-85.1484745","35.0034941"]',
        location_type: 'Pickup'
      },
      {
        id: 5,
        name: 'Burn Bootcamp',
        description: 'Burn Bootcamp',
        street_addr: '6413 Lee Hwy #113',
        city: 'Chattanooga',
        state: 'TN',
        zip: '37421',
        opens: '4:00pm',
        closes: '7:00pm',
        coordinates: '["-85.1780835","35.0350449"]',
        location_type: 'Pickup'
      },
      {
        id: 2,
        name: '',
        description: '',
        street_addr: '',
        city: '',
        state: 'TN',
        zip: '',
        opens: '',
        closes: '',
        coordinates: '',
        location_type: ''
      },
      {
        id: 2,
        name: '',
        description: '',
        street_addr: '',
        city: '',
        state: 'TN',
        zip: '',
        opens: '',
        closes: '',
        coordinates: '',
        location_type: ''
      },
      {
        id: 2,
        name: '',
        description: '',
        street_addr: '',
        city: '',
        state: 'TN',
        zip: '',
        opens: '',
        closes: '',
        coordinates: '',
        location_type: ''
      },
      {
        id: 2,
        name: '',
        description: '',
        street_addr: '',
        city: '',
        state: 'TN',
        zip: '',
        opens: '',
        closes: '',
        coordinates: '',
        location_type: ''
      },
    ])
  }
}

module.exports = LocationSeeder
