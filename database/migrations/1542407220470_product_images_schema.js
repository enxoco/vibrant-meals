'use strict'

const Schema = use('Schema')

class ProductImagesSchema extends Schema {
  up () {
    this.create('product_images', (table) => {
      table.increments()
      table.string('path').nullable
      table.integer('item_id').nullable
      table.timestamps()
    })
  }

  down () {
    this.drop('product_images')
  }
}

module.exports = ProductImagesSchema
