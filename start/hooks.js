const { hooks } = require('@adonisjs/ignitor')
const moment = require('moment')


hooks.after.providersBooted(() => {
  const View = use('View')

  View.global('convertTime', function (time) {

    // Remove milliseconds from our time object
      var t = time.split('.')[0]

      // convert 24hour to 12 hour
      return moment(t, ["HH:mm:ss"]).format("h:mm A")
  })

  View.global('currency', function(num) {
    return `$${(num / 100).toFixed(2)}`
  })
})