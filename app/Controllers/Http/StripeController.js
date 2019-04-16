'use strict'
const Env = use('Env')
const fs = require('fs')
const Helpers = use('Helpers')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
var orderCount = parseInt(fs.readFileSync(`${Helpers.appRoot()}/config/orderCounter.txt`))

class StripeController {

    // Simple webhook endpoint to add a semi unique more user friendly id to our Stripe orders.
    // Reads a number from a text file, increments it by 1 and assigns it to the metadata.orderId
    // for the current order.
    async orderCreatedHook({request, response}) {
        orderCount += 1
        var obj = request.all()
        var orderId = obj.data.object.id

        var update = await stripe.orders.update(orderId, {
            metadata: {
                orderId: orderCount
            }
        })

        fs.writeFileSync(`${Helpers.appRoot()}/config/orderCounter.txt`, orderCount)


        return response.send(orderCount)
    }
}

module.exports = StripeController
