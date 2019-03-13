'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * 
 * Middleware to check whether a user has access to request a particular route or not.
 * Currently just checks whether user is admin or not but can be expanded to check for
 * different levels of permission and route accordingly
 * 
 */
class AdminAccess {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next) {

    if (auth.user.user_level == 'customer' || !auth.user) {
      console.log('customer')
      response.redirect('back')
    }
    // call next to advance the request
    await next()
  }
}

module.exports = AdminAccess
