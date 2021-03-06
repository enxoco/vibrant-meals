const { hooks } = require('@adonisjs/ignitor')
const moment = require('moment')
require('moment-countdown');
const _ = require('lodash')


hooks.after.providersBooted(() => {
  const View = use('View')
  const Exception = use('Exception')

  Exception.handle('HTTP_EXCEPTION', async (error, { response, session }) => {

    return response.send('back')
    return
  })

  View.global('convertCatName', function(label) {
    
    label = label.replace(' ', '_')
    label = label.toLowerCase()
    return label
  })


  View.global('timestamp', function(week, factor, format){

    if (factor === 'add') var moment_prefix = moment().add(week, 'weeks')
    if (factor === 'subtract') var moment_prefix = moment().add(week, 'weeks')
    if (!factor) var moment_prefix = moment()


      var startWeek = moment_prefix.startOf('isoWeek').format(format)
      var endWeek = moment_prefix.endOf('isoWeek').format(format)
      var startTimestamp = moment(startWeek).unix()
      var endTimestamp = moment(endWeek).unix()

      return {
        startWeek,
        endWeek,
        startTimestamp,
        endTimestamp
      }

    
  })



  View.global('lastWeek', function(week){
    var date = moment().subtract(week, 'weeks').startOf('isoWeek').format('YYYY-MM-DD') + ' - ' + moment().subtract(week, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
    return date
  })


  View.global('convertTime', function (time) {


    var year = moment().format("YYYY-MM-DD")
    var dateString = year + " " + time
    var timeToClosing = moment(dateString.toString()).countdown()
    if (timeToClosing.hours == 0) {
      return this.safe('<a style="color:red;">'+ timeToClosing +'</a>')
    } else {
      return this.safe('<a style="color:green;">'+ timeToClosing +'</a>')

    }
  })

  View.global('currency', function(num, removeDollarSign) {
    if (removeDollarSign) {
      return `${(num / 100).toFixed(2)}`
    }
    return `$${(num / 100).toFixed(2) * 1}`
  })

  View.global('splitFilterTags', function(obj){
    if (obj == undefined) {
      return obj
    } else {
      obj = obj.split('_')
      switch(obj[0]) {
        case 'ELT':
          return 'Elite'
        case 'BF':
          return 'Breakfast'
        case 'PB':
          return 'Plant_Based'
        case 'P':
          return 'Performance'
        case 'LC':
          return 'Low_Carb'
        case 'S':
          return 'Snacks'
        case 'D':
          return 'Drinks'
        case 'W30':
          return 'Whole_30'
        default:
          return 'Everyday'
    }
  }
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


  View.global('registrationForm', function(){
    let stripe_pk = Env.get('STRIPE_PK')
    

    
    return day
  })


  View.global('convertTime', function(unix, format){
    var day = moment.unix(unix).format('LLL')
    if (format) {
      var day = moment.unix(unix).format(format)
    }
    return day
  })

  View.global('secure', function(url){
    if (url && url.includes('http:')) {
      return url.replace('http:', 'https:')
    } else {
      return url
    }
  })

  View.global('nutritionFooterDesktop', function(obj){
    var newObj = Object.assign({}, obj);


    var count = Object.keys(newObj)
    var macros = []
    macros.push({
      'calories': newObj['calories'] ? newObj['calories'] : 0,
      'proteins': newObj['proteins'] ? newObj['proteins'] : 0,
      'fats': newObj['fats'] ? newObj['fats'] : 0,
      'carbs': newObj['carbs'] ? newObj['carbs'] : 0

    })
    // var macros = newObj.sort((a,b) => (a.order > b.order) ? 1 : -1) 




    macros = macros[0]

    var div = ``
    div += `<div class="col pr-0">
    <h5>
    ${macros.calories ? macros.calories : 0} 
    <br>
      <small>Calories</small>
    </h5>
  </div>`
  div += `<div class="col pr-0">
  <h5>
  ${macros.proteins ? macros.proteins : 0}g 
  <br>
    <small>Protein</small>
  </h5>
</div>`
    div += `<div class="col pr-0 d-none d-md-none d-lg-none d-xl-block">
    <h5>
    ${macros.fats ? macros.fats : 0}g 
    <br>
      <small>Fats</small>
    </h5>
  </div>`

  div += `<div class="col pr-0 d-none d-md-none d-lg-none d-xl-block">
  <h5>
  ${macros.carbs ? macros.carbs : 0}g 
  <br>
    <small>Carbs</small>
  </h5>
</div>`

      return this.safe(div)
  })

  View.global('menuPage', function(){
    if (window.location.href.includes('menu')) {
      return true
    } else {
      return false
    }
  })

  View.global('dateFormat', function(day, weekCode){
    if (day == 'monday') {
      return moment().add(weekCode, 'weeks').startOf('isoweek').format('L')
    }

  })

  View.global('checkActiveFilters', function(url, code){
    if (url.split('/')[3]) {
      let filter = url.split('/')[3]
      filter = filter.split(',')
      for (let i = 0; i < filter.length; i++) {
        if (filter[i] === code) return 'active'
      }
    }

  })
  View.global('nutritionFooterMobile', function(obj){
    var newObj = Object.assign({}, obj);


    delete newObj.category
    delete newObj.size
    delete newObj.filters
    delete newObj.name
    delete newObj.description
    var count = Object.keys(newObj)

    if (count.length == 0) {
      return this.safe('<div class="col-9 pb-2"></div>')
    }
    var div = ``
    if (count.length >= 3) {
      div = '<div class="col-10 d-flex justify-content-between">'
      obj.calories ? div += `<strong>Calories:</strong> ${obj.calories}` : NULL
      obj.proteins ? div += `<strong>Protein:</strong> ${obj.proteins}` : NULL

      div += '</div>'
    }

      return this.safe(div)
  })
  
})