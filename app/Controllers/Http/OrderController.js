'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))


class OrderController {

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
        const {id, status} = request.all()
        if (status === 'refund') {
            var update = await stripe.refunds.create({
                charge: id
            })
        } else {
            var update = await stripe.orders.update(id,{
                status: status
            })
        }
        return response.send(update)
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

        // Grab our open orders from stripe and massage into an array of skus
        const orders = await stripe.orders.list({})
        var order = orders.data
        var itemList = []
        const orderCount = orders.data.length
        
        var deliveries = 0
        var wednesdayFulfillments = []
        var mondayFulfillments = []
        var fulfillments = []
        var pickups = 0
        var revenue = 0
        // Iterate over our open/pending orders and grab each menu item
        for (var i = 0; i < order.length; i++) {
            revenue += order[i].amount

            if (order[i].metadata.fulfillment_method && order[i].metadata.fulfillment_method == 'pickup') {
                fulfillments.push(order[i])
                pickups++
            }
            if (order[i].metadata.fulfillment_method && order[i].metadata.fulfillment_method == 'delivery') {
                fulfillments.push(order[i])
                deliveries++
            }
            if (order[i].metadata.fulfillment_day && order[i].metadata.fulfillment_day == 'wednesday') {
                wednesdayFulfillments.push(order[i])
            }
            if (order[i].metadata.fulfillment_day && order[i].metadata.fulfillment_day == 'monday') {
                mondayFulfillments.push(order[i])
            }
            for (var x = 0; x < order[i].items.length; x++) {
                var item = order[i].items[x]
                if (item.amount != 0) {  
                    for (var z = 0; z < item.quantity; z++) {
                        itemList.push({item: item.parent, desc: item.description, day: order[i].metadata.fulfillment_day})
                    }
                }
            }
        }
        revenue = (revenue / 100).toFixed(2)
        
        // Combine all matching skus and add a count for each
        const result = [...itemList.reduce((r, e) => {
            let k = `${e.item}`
            if (!r.has(k)) r.set(k, { ...e, count: 1 })
            else r.get(k).count++
            return r
        }, new Map).values()]

        // Sort our results by the total for a sku
        var byDate = result.slice(0)
        var sorted = byDate.sort(function (a, b) {
            return b.count - a.count
        })
        return view.render('layout.admin.orders', {orders: sorted, pagetype: 'Pending orders', orderCount, deliveries, pickups, wednesdayFulfillments, mondayFulfillments, revenue, fulfillments})
    }
}

module.exports = OrderController
