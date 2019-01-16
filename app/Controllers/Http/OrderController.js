'use strict'
const Database = use('Database')
var stripe = require("stripe")("sk_test_ZmWaFEiBn0H63gNmfCacBolp");

class OrderController {

    async viewOrdersAdmin ({ request, response, session, view }) {

        // const allOrders = await Database
        //     .table('orders')

        // return view.render('admin.orders', {orders: allOrders})
        const orders = await stripe.orders.list(
            { status: 'created' },
          );

          var order = orders.data
          var itemList = []

          for (var i = 0; i < order.length; i++) {
              for (var x = 0; x < order[i].items.length; x++) {
                  var item = order[i].items[x]
                  if (item.amount != 0) {  
                      for (var z = 0; z < item.quantity; z++) {
                          itemList.push(item.parent)
                          
                      }
                  }
              }
          }
        //   var counts = []

        //   for (var z = 0; z < itemList.length - 1; z++) {
        //       var v = z + 1
        //       console.log(z, v)
        //     if (itemList[v].sku && itemList[z].sku == itemList[v].sku) {
        //         itemList[v].quantity += itemList[z].quantity
        //         itemList.pop(itemList[z])
        //     }
        //   }

        return response.send(itemList)
    }
}

module.exports = OrderController
