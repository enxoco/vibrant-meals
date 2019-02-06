const { hooks } = require('@adonisjs/ignitor')
const moment = require('moment')
require('moment-countdown');

hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('convertCatName', function(label) {
    
    label = label.replace(' ', '_')
    label = label.toLowerCase()
    console.log(label)
    return label
  })

  View.global('convertTime', function (time) {


    var year = moment().format("YYYY-MM-DD")
    var dateString = year + " " + time
    var timeToClosing = moment(dateString.toString()).countdown()
    console.log(dateString.toString())
    if (timeToClosing.hours == 0) {
      return this.safe('<a style="color:red;">'+ timeToClosing +'</a>')
    } else {
      return this.safe('<a style="color:green;">'+ timeToClosing +'</a>')

    }
  })

  View.global('currency', function(num) {
    return `$${(num / 100).toFixed(2)}`
  })

  View.global('parseItem', function(item){

    var itemKeys = {
      price: item.price,
      id: item.stripe_id,
      quantity: 0

    }
 
    return JSON.stringify(item)
    
  }) 
})