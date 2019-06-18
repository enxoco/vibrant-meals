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
            message.subject('Order Confirmation')
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
                return view.render('Checkout.confirmation', {order})
            }
        }

        var order = await stripe.orders.list({
            customer: auth.user.stripe_id,
            limit: 1
        })
    }

    async batchFulfillStripe(id) {
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
        }
        return response.send(update)
    }

    async postRefund ({request, response}) {
        const {charge, amount} = request.all()

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
            return obj.metadata.fulfillment_day == 'monday'
        })
        
        var allOrdersWednesday = _.pickBy(orders, function(obj){
            return obj.metadata.fulfillment_day == 'wednesday'
        })



        var itemList = []
        var monList = []
        var wedList = []
        
        const orderCount = orders.length
        
        var deliveries = 0
        var wednesdayFulfillments = []
        var mondayFulfillments = []
        var fulfillments = []
        var pickups = 0
        var revenue = 0
        // Iterate over our open/pending orders and grab each menu item
        for (var i = 0; i < orders.length; i++) {
            revenue += orders[i].amount

            if (orders[i].metadata.fulfillment_method && orders[i].metadata.fulfillment_method == 'pickup') {
                fulfillments.push(orders[i])
                pickups++
            }
            if (orders[i].metadata.fulfillment_method && orders[i].metadata.fulfillment_method == 'delivery') {
                fulfillments.push(orders[i])
                deliveries++
            }
            if (orders[i].metadata.fulfillment_day && orders[i].metadata.fulfillment_day == 'wednesday') {
                wednesdayFulfillments.push(orders[i])
            }
            if (orders[i].metadata.fulfillment_day && orders[i].metadata.fulfillment_day == 'monday') {
                mondayFulfillments.push(orders[i])
            }
            for (var x = 0; x < orders[i].items.length; x++) {
                var item = orders[i].items[x]
                if (item.amount != 0) {  
                    for (var z = 0; z < item.quantity; z++) {
                        if (orders[i].metadata.fulfillment_day == 'monday') {
                            monList.push({item: item.parent, desc: item.description, day: orders[i].metadata.fulfillment_day, date: orders[i].metadata.fulfillment_date})
                        } else if(orders[i].metadata.fulfillment_day == 'wednesday') {
                            wedList.push({item: item.parent, desc: item.description, day: orders[i].metadata.fulfillment_day, date: orders[i].metadata.fulfillment_date})
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

        var wedResult = [...wedList.reduce((r, e) => {
            let k = `${e.item}`
            if (!r.has(k)) r.set(k, { ...e, count: 1 })
            else r.get(k).count++
            return r
        }, new Map).values()]

        // Sort our results by the total for a sku
        monResult = monResult.sort(function (a, b) {
            return b.count - a.count
        })
        wedResult = wedResult.sort(function (a, b) {
            return b.count - a.count
        })


        
        return view.render('layout.admin.orders', {
            pagetype: 'Pending orders', 
            orderCount, 
            deliveries, 
            pickups, 
            wednesdayFulfillments, 
            mondayFulfillments, 
            revenue, 
            fulfillments,
            monResult,
            wedResult
        })
    }
}

module.exports = OrderController
