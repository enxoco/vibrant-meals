'use strict'
const Database = use('Database')

class HomeController {
  async index ({ view }) {
    const items = await Database
    .select('*')
    .from('items')
    console.log(items[0])
    return view.render('welcome', {items})
  }
}

module.exports = HomeController
