'use strict'
const Database = use('Database')

class HomeController {
  async index ({ response, view }) {
    try {
      const items = await Database
      .select('*')
      .from('items')
      .innerJoin('product_images', 'items.id', 'product_images.item_id')
      return response.send(items)
      return view.render('welcome', {items})
    } catch (error) {
      return Response.send(`error ${error}`)
    }

  }
}

module.exports = HomeController
