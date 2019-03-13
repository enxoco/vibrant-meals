'use strict'
const geoip = require('geoip-lite')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IpLookup {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    const ip = request.ip()
    console.log(request.ip())
    request.cords = geoip.lookup(ip).ll
    // call next to advance the request
    await next()
  }
}

module.exports = IpLookup
