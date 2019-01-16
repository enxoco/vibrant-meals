'use strict'
const Database = use('Database')
var stripe = require("stripe")("sk_test_ZmWaFEiBn0H63gNmfCacBolp");

class CheckoutController {

    async startCheckout({ request, response, session}) {
        var cart = session.get('cartItem')
        var stripeItems = []
        for (var i = 0; i < cart.length; i++) {
            stripeItems.push({
              type: 'sku',
              parent: cart[i].sku,
              quantity: parseInt(cart[i].quantity),
            })

        }

        const user = await Database
        .table('users')
        .select('id', 'name', 'email', 'zip', 'fulfillment_method', 'is_guest', 'fulfillment_day', 'pickup_location')
        .where('id', session.get('adonis_auth'))  
        .first()

        // Todo - need to distinguish between pickup and delivery
        // also need to decide between ala carte and subscription

        // Shipping info based on user preferences

        if (user.fulfillment_method == 'pickup') { // User is picking up from store, need to find store address from preferences
          const location = await Database
            .table('locations')
            .where('id', user.pickup_location)
            .first()
            var order = await stripe.orders.create({
              currency: 'usd',
              items: stripeItems,
              shipping: { // shipping address could be either customers address for delivery or store address for pickup
                name: user.name,
                address: {
                  line1: location.street_addr,
                  city: location.city,
                  state: location.state,
                  country: 'US',
                  postal_code: location.zip
                }
              },
              email: user.email
            });
        }


          await Database
            .insert({
              user_id: 1,
              order_id: order.id,
              is_paid: 0
            })
            .table('orders')
        return response.send(order.id)
    }
}

module.exports = CheckoutController