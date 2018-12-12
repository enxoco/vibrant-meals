'use strict'
const Database = use('Database')
/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class UserSeeder {
  async run () {
    await Database
    .table('users')
    .insert([
      {
        id: 1,
        email: 'mike@enxo.co',
        password: '$2a$10$4h1tqWVMQz4t4hvgUyW1pOKRG7qfrD0FAodUHoO0x1pc2MGqEmSze',
        name: 'Mike Conrad',
        username: 'murph',
        stripe_id: 'cus_E6HbS2VLOhXNB1'
      },
    ])
  }
}

module.exports = UserSeeder
