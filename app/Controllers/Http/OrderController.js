'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
const _ = require('lodash')
const moment = require('moment')
const Mail = use('Mail')



class OrderController {




    async confirmationEmail({request, response, params, view, auth}) {
        var cust = await stripe.customers.retrieve(auth.user.stripe_id)
        var order = await stripe.orders.list({
            customer: auth.user.stripe_id,
            limit: 1
        })
        

        await Mail.send('auth.email.order-confirmation', {
            order: order.data[0]
          }, (message) => {
            message.to(auth.user.email, auth.user.name)
            message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
            message.subject('Vibrant Meals Order Confirmation')
          })

    }

    async showConfirmation({ request, response, view, auth }) {
        var cust = await stripe.customers.retrieve(auth.user.stripe_id)
        var order = await stripe.orders.list({
            customer: auth.user.stripe_id,
            limit: 1
        })
        if (order.orderId) {
            console.log('check 1')
            return view.render('Checkout.confirmation', {order})
        } else {
            console.log('check 2')
            var order = await stripe.orders.list({
                customer: auth.user.stripe_id,
                limit: 1
            })

            if (order.orderId) {
                return view.render('Checkout.confirmation', {order})   
            } else {
                var order = await stripe.orders.list({
                    customer: auth.user.stripe_id,
                    limit: 1
                })
                try {
                    for (var i = 0; i < order.data[0].items.length; i++) {
                        let item = order.data[0].items[i]
                        if (item.type === 'sku') {
                            let sku = await stripe.skus.retrieve(item.parent)
                            item.image = sku.image
                        }
                    }
                } catch(e) {
                    session.flash({'error': 'Your order could not be completed at this time.'})
                    return response.redirect('back')
                }
                var cust = await stripe.customers.retrieve(auth.user.stripe_id)
                await Mail.send('auth.email.order-confirmation', {
                    order: order.data[0],
                    customer: cust
                  }, (message) => {
                    message.to(auth.user.email, auth.user.name)
                    message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
                    message.subject('Order Confirmation')
                  })
                  try {
                    return view.render('Checkout.confirmation', {order})

                  } catch(e) {
                      session.flash({'error': 'something went wrong'})
                      return response.redirect('back')
                  }
            }
        }
    }

    async batchFulfillStripe(id) {
        const order = await stripe.orders.retrieve(id)
        const customer = await stripe.customers.retrieve(order.customer)
        await Mail.send('auth.email.order-fulfilled', {
            order,
            customer
          }, (message) => {
            message.to(customer.email, customer.metadata.name)
            message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
            message.subject('Order Fulfilled')
          })
        await stripe.orders.update(id,{status:'fulfilled'})
    }

    async batchFulfill ({request, response}) {
        const { ids } = request.all()
        ids.forEach(id => {      
            this.batchFulfillStripe(id)
        });
        return response.send({status: 'Success'})
    }

    async updateOrderById ({request, response, params}) {
        const {id, status, amount} = request.all()
        if (status === 'refund') {
            var update = await stripe.refunds.create({
                charge: id,
                amount: amount
            })
        } else {
            var update = await stripe.orders.update(id,{
                status: status
            })
            const order = await stripe.orders.retrieve(id)
            const customer = await stripe.customers.retrieve(order.customer)

            if (status.toLowerCase() === 'canceled') {
                await Mail.send('auth.email.order-cancel', {
                    order,
                    customer
                  }, (message) => {
                    message.to(customer.email, customer.metadata.name)
                    message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
                    message.subject('Order Cancelation')
                  })  
            } else {
                await Mail.send('auth.email.order-fulfilled', {
                    order,
                    customer
                  }, (message) => {
                    message.to(customer.email, customer.metadata.name)
                    message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
                    message.subject('Order Confirmation')
                  })
            }

        }
        return response.send(update)
    }

    async postRefund ({request, response, view}) {
        const {charge, amount} = request.all()
        const chargeDetails = await stripe.charges.retrieve(charge)
        const order = await stripe.orders.retrieve(chargeDetails.order)
        var customer = await stripe.customers.retrieve(order.customer)
        await Mail.send('auth.email.order-refund', {
            amount,
            order,
            customer
          }, (message) => {
            message.to(customer.email, customer.metadata.name)
            message.from(Env.get('MAIL_FROM_EMAIL'), Env.get('MAIL_FROM_NAME'))
            message.subject('Vibrant Meals Order Refund')
          })


        var refund = await stripe.refunds.create({
            charge: charge,
            amount: amount
        })

        return response.send(refund)
    }

    async viewOrderById ({request, params, response, view}) {
        var id = params.orderId
        var order = await stripe.orders.retrieve(id)
        if (order.status_transitions.paid != null) {
            var charge = await stripe.charges.retrieve(order.charge)
        } else {
            var charge = {
                refunded: false
            }
        }
        return view.render('admin.order-details', {order, charge})
    }

    async viewOrdersAdmin ({ request, response, session, view }) {
        var today = moment();
        var from_date = moment().startOf('isoweek').unix()
        var to_date = moment().endOf('isoweek').unix()

        let thursday
        let monday
      
        monday = moment().add(1, 'weeks').startOf('isoweek').format('MMM DD')
        thursday = moment().add(1, 'weeks').startOf('isoweek').add(3, 'days').format('MMM DD')
        if (moment().format('dddd') === 'Monday' && moment().format('H') < 12) {
            thursday = moment().add(0, 'weeks').startOf('isoweek').add(3, 'days').format('MMM DD')
          }
          if (moment().format('dddd') === 'Friday' || moment().format('dddd') === 'Saturday' || moment().format('dddd') === 'Sunday') {
            thursday = moment().add(1, 'weeks').startOf('isoweek').add(3, 'days').format('MMM DD')
         
          } 
        if (moment().format('dddd') == 'Friday') {
            let format = 'HH:mm:ss'
            let t = moment().format(format)
            let time = moment(t, format)
            let beforeTime = moment('00:00:00', format)
            let afterTime = moment('08:00:00', format)
        
            if (time.isBetween(beforeTime, afterTime)) {
              monday = moment().add(1, 'weeks').startOf('isoweek').format('MMM DD')
            } else {
              monday = moment().add(2, 'weeks').startOf('isoweek').format('MMM DD')
            }
          }
          if (moment().format('dddd') == 'Saturday' || moment().format('dddd') == 'Sunday') {
            monday = moment().add(2, 'weeks').startOf('isoweek').format('MMM DD')
        
          }

        // Grab our open orders from stripe and massage into an array of skus
        var orders = await stripe.orders.list({
            limit: 100,
            created: {
                gte: moment().startOf('isoweek').unix()
            }
            
        })
        if (orders.has_more) {
            var moreOrders = await stripe.orders.list({
            limit: 100,
            starting_after: orders.data[(orders.data.length - 1)].id
        }) 
        }



        
        orders = orders.data
        moreOrders ? moreorders = moreOrders.data : null

        var allOrdersMonday = _.pickBy(orders, function(obj){
            return obj.metadata.fulfillment_day === 'monday' && obj.status === 'paid' && obj.metadata.fulfillment_date === monday
        })
        
        var allOrdersThursday = _.pickBy(orders, function(obj){
            return obj.metadata.fulfillment_day === 'thursday' && obj.status === 'paid' && obj.metadata.fulfillment_date === thursday
        })

        let ord = []

        for (var i = 0; i < orders.length; i++) {
            let order = orders[i]
            let items = orders[i].items
            let filteredItems = []
            let orderQuantity = 0
            Object.keys(items).forEach(function (item) {
                if (order.status != 'canceled') {
                    if (items[item].description === 'Shipping' || items[item].type != 'sku') {
                    } else {
                        orderQuantity += items[item].quantity
                        filteredItems.push(items[item])
                    }
                }

            });
            if (order.metadata.fulfillment_date && order.status != 'canceled') {
                if (order.metadata.fulfillment_date === monday || order.metadata.fulfillment_date === thursday) {
                    var obj = {
                        name: order.shipping.name,
                        id: order.metadata.orderId,
                        date: order.metadata.fulfillment_date,
                        fulfilmentMethod: order.metadata.fulfillment_method,
                        address: order.shipping.address.line1,
                        city: order.shipping.address.city,
                        state: order.shipping.address.state,
                        items: filteredItems,
                        orderQuantity: orderQuantity,
                        deliveryWindow: order.metadata.deliveryWindow,
                        allergy: order.metadata.allergy_info ? order.metadata.allergy_info : '',
                        delivery: order.metadata.delivery_notes? order.metadata.delivery_notes : ''
                    }
                    ord.push(obj)

                }
            }


        }


        var itemList = []
        var monList = []
        var thursList = []
        var outstandingOrders = orders.filter(function (el) {
            return el.status != 'canceled'
          });
        
        const orderCount = outstandingOrders.length

        
        var deliveries = 0
        var thursdayFulfillments = []
        var mondayFulfillments = []
        var fulfillments = []
        var pickups = 0
        var revenue = 0
        // Iterate over our open/pending orders and grab each menu item
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].status != 'canceled') {
                revenue += orders[i].amount

                if (orders[i].metadata.fulfillment_method && orders[i].metadata.fulfillment_method == 'pickup') {
                    fulfillments.push(orders[i])
                    pickups++
                }
                if (orders[i].metadata.fulfillment_method && orders[i].metadata.fulfillment_method == 'delivery') {
                    fulfillments.push(orders[i])
                    deliveries++
                }
                if (orders[i].metadata.fulfillment_day && orders[i].metadata.fulfillment_day.toLowerCase() == 'thursday' && orders[i].metadata.fulfillment_date === thursday) {
                
                    thursdayFulfillments.push(orders[i])
                }
                if (orders[i].metadata.fulfillment_day && orders[i].metadata.fulfillment_day.toLowerCase() == 'monday' && orders[i].metadata.fulfillment_date === monday) {
                    mondayFulfillments.push(orders[i])
                }
    
                for (var x = 0; x < orders[i].items.length; x++) {
                    var item = orders[i].items[x]
                    if (item.amount != 0) {  
                        for (var z = 0; z < item.quantity; z++) {
                            if (orders[i].metadata.fulfillment_day) {
                                if (orders[i].metadata.fulfillment_day.toLowerCase() === 'monday' && orders[i].metadata.fulfillment_date === monday) {
                                    monList.push({item: item.parent, desc: item.description, day: orders[i].metadata.fulfillment_day, date: orders[i].metadata.fulfillment_date})
                                } else if(orders[i].metadata.fulfillment_day.toLowerCase() === 'thursday' && orders[i].metadata.fulfillment_date === thursday) {
                                    thursList.push({item: item.parent, desc: item.description, day: orders[i].metadata.fulfillment_day, date: orders[i].metadata.fulfillment_date})
                                }
                            }
    
                        }
                    }
                }
            }

        }
        revenue = (revenue / 100).toFixed(2)
        

        // Combine all matching skus and add a count for each
        var monResult = [...monList.reduce((r, e) => {
            let k = `${e.item}`
            if (!r.has(k)) r.set(k, { ...e, count: 1 })
            else r.get(k).count++
            return r
        }, new Map).values()]

        var thursResult = [...thursList.reduce((r, e) => {
            let k = `${e.item}`
            if (!r.has(k)) r.set(k, { ...e, count: 1 })
            else r.get(k).count++
            return r
        }, new Map).values()]

        // Sort our results by the total for a sku
        monResult = monResult.sort(function (a, b) {
            return b.count - a.count
        })
        thursResult = thursResult.sort(function (a, b) {
            return b.count - a.count
        })
        
        return view.render('layout.admin.orders', {
            pagetype: 'Pending orders', 
            orderCount, 
            deliveries, 
            pickups, 
            thursdayFulfillments, 
            mondayFulfillments, 
            revenue, 
            fulfillments,
            monResult,
            thursResult,
            ord
        })
    }
}

module.exports = OrderController
