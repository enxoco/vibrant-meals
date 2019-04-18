const { hooks } = require('@adonisjs/ignitor')
const moment = require('moment')
require('moment-countdown');
const _ = require('lodash')

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

  View.global('splitFilterTags', function(obj){
    console.log(obj)
    if (obj == undefined) {
      return obj
    } else {
      obj =  obj.replace(' ', '_')
      console.log(obj.replace(/,/g, ' '))
      return obj.replace(/,/g, ' ')
    }
    // return obj.replace(/,/g, ' ')
  }) 

  View.global('getKeys', function(obj) {
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

  View.global('secure', function(url){
    return url.replace('http:', 'https:')
  })

  View.global('nutritionFooterDesktop', function(obj){
    delete obj.category
    delete obj.size
    delete obj.filters
    delete obj.name
    delete obj.description
    var count = Object.keys(obj)
    if (count.length == 0) {
      return this.safe('<div class="col-9 pb-2"></div>')
    }

    function addGrams(name, value){
      if (name.toLowerCase() == 'fats' || name.toLowerCase() == 'carbs' || name.toLowerCase() == 'proteins') {
        return `${value}g`
      } else {
        return '0'
      }
    }
    var div = ``
    if (count.length >= 4) {
      for (var i = 0; i < Object.keys(obj).length; i++) {
        if (i == 4) {break}
        var name = Object.keys(obj)[i]
        var value = obj[name]
        div += `<div class="col-2 ml-auto d-none d-lg-block">
        <h5>
         ${addGrams(name, value)}
          <br>
          <small>${_.capitalize(name)}</small>
        </h5>
      </div>`
      }
    }

      return this.safe(div)
  })

  View.global('nutritionFooterMobile', function(obj){
    delete obj.category
    delete obj.size
    delete obj.filters
    delete obj.name
    delete obj.description
    var count = Object.keys(obj)
    if (count.length == 0) {
      return this.safe('<div class="col-9 pb-2"></div>')
    }
    var div = ``
    if (count.length >= 3) {
      div = '<div class="col-10 d-flex justify-content-between">'

      for (var i = 0; i < Object.keys(obj).length; i++) {
        if (i == 3) {break}
        var name = Object.keys(obj)[i]
        var value = obj[name]
        div += `${_.capitalize(name)}:<strong>${value}</strong>`
      }
      div += '</div>'
    }

      return this.safe(div)
  })
  
})