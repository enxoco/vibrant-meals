'use strict'

const Schema = use('Schema')

class ProductImagesSchema extends Schema {
  up () {
    this.createIfNotExists('product_images', table => {
      table.increments('product_image_id')
      table.string('path').nullable()
      // table.foreign('item_id').references('items.id')

      table.timestamps()
    })
  }

  down () {
    this.drop('product_images')
  }
}

module.exports = ProductImagesSchema
