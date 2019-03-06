'use strict'
const Database = use('Database')
var stripe = require("stripe")("sk_test_ZmWaFEiBn0H63gNmfCacBolp");

class OrderController {

    async viewOrdersAdmin ({ request, response, session, view }) {

        // Grab our open orders from stripe and massage into an array of skus
        const orders = await stripe.orders.list({})
        var order = orders.data
        var itemList = []
        const orderCount = orders.data.length
        
        var deliveries = []
        var wednesdayFulfillments = []
        var mondayFulfillments = []
        var pickups = []
        var revenue = 0
        // Iterate over our open/pending orders and grab each menu item
        for (var i = 0; i < order.length; i++) {
            revenue += order[i].amount

            if (order[i].metadata.fulfillment_method && order[i].metadata.fulfillment_method == 'pickup') {
                pickups.push(order[i])
            }
            if (order[i].metadata.fulfillment_method && order[i].metadata.fulfillment_method == 'delivery') {
                deliveries.push(order[i])
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
        return view.render('layout.admin.orders', {orders: sorted, pagetype: 'Pending orders', orderCount, deliveries, pickups, wednesdayFulfillments, mondayFulfillments, revenue})
    }
}

module.exports = OrderController
