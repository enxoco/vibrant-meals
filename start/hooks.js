const { hooks } = require('@adonisjs/ignitor')
const moment = require('moment')
require('moment-countdown');
var sr = require('screenres');

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
    console.log(num)

    return `$${(num / 100).toFixed(2) * 1}`
  })


  View.global('getKeys', function(obj) {
    console.log(obj)
    // return Object.keys(obj)
  })
  View.global('parseItem', function(item){

    var itemKeys = {
      price: item.price,
      id: item.stripe_id,
      quantity: 0

    }
 
    return JSON.stringify(item)
    
  }) 

  View.global('screenWidth', function(){
    var d = sr.get(); // [1440, 900]
    return parseInt(d[1])

  })

  View.global('convertTime', function(unix){
    var day = moment.unix(unix).format('LLL')
    return day
  })
})