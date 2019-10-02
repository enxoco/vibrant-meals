'use strict'
const edge = require('edge.js')
const moment = require('moment')

class ViewGlodalMiddleware {
  async handle ({ request }, next) {
    edge.global('currentYear', () => {
      return moment().format('YYYY')
    })

    edge.global('join', (str1, str2) => {
      return `{{ ${str1}${str2.toLowerCase()} }}`
    })


    edge.global('compareKeys', (item, str) => {
      var key = 'is_' + str.toLowerCase().replace(/ /g, '_')
      console.log(item[key])

      if (item[key] == 1) {
        return 'checked'

      }
      return false
    })

    edge.global('inArray', (arr, needle) => {
      let i = arr.length
      while (i--) {
        if (arr[i] === needle) {
          return true
        }
      }
      return false
    })

    await next()
  }
}

module.exports = ViewGlodalMiddleware
