'use strict'
const Database = use('Database')
const Item = use('App/Models/Item')

class HomeController {
  async index ({ response, view }) {
    try {
      const items = await Database
      .select('*')
      .from('items')
      return view.render('welcome', {items, is_admin: false})
    } catch (error) {
      return Response.send(`error ${error}`)
    }

  }
}

module.exports = HomeController
