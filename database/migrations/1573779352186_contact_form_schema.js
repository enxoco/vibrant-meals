'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ContactFormSchema extends Schema {
  up () {
    this.create('contact_form', (table) => {
      table.increments()
      table.string('name')
      table.string('email')
      table.string('phone')
      table.string('referal')
      table.text('message')
      table.int('read_by_admin')
      table.string('form_id')
      table.string('subject')
      table.string('business')
      table.timestamps()
    })
  }

  down () {
    this.drop('contact_form')
  }
}

module.exports = ContactFormSchema
