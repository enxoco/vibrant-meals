'use strict'
const Database = use('Database')
const Env = use('Env')
const stripe = require('stripe')(Env.get('STRIPE_SK'))
stripe.setApiVersion('2019-03-14');
const moment = require('moment')


var dateCodes = {
  previous: moment().subtract(1, 'week').isoWeek(),
  current: moment().isoWeek(),
  next: moment().add(1, 'week').isoWeek()
}


const Drive = use('Drive')
const Helpers = use('Helpers')
const cheerio = require('cheerio')
const opencage = require('opencage-api-client');

class AdminController {

  async showApiSettings({request, response, view}) {
    return view.render('layout.admin.api')
  }


  async fullRefund(charge) {
    const refund = await stripe.refunds.create({
      charge: charge
    });
    return refund
  }
  async cancelOrder({ request, response, auth, session, params }) {

    const refund = await this.fullRefund(params.charge)

    const status = await Database
      .table('orders')
      .where('orderId', params.order)
      .update({
        payment_status: 'refunded',
        order_status: 'cancelled'
      })

    var message = { 'status': 'order' + params.order + ' has been cancelled.  Refund id is ' + refund }
    return response.send(message)


  }

  async checkDuplicateInObject(propertyName, inputArray) {
    var seenDuplicate = false,
      testObject = {};
    let final = []
    inputArray.map(function (item) {
      var itemPropertyName = item[propertyName];
      if (itemPropertyName in testObject) {
        testObject[itemPropertyName].quantity++;
        item.duplicate = true;
        seenDuplicate = true;
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });
    for (var i = 0; i < inputArray.length; i++) {
      if (!inputArray[i].duplicate) final.push(inputArray[i])
    }
    return final;
  }

  // API method to return a filtered list of orders.  If a day of the week is passed in, then only orders
  // set to be fulfilled on that day will be shown.  Otherwise all orders between matching dates will be shown.
  async filteredOrdersByDate({ request, response, params }) {

    if (params.filter === 'export') {
      var orders = await Database
      .raw(`SELECT * FROM orders WHERE fulfillment_date BETWEEN "${params.start}" AND "${params.end}";`)

    let masterOrders = []
    orders = orders[0]
    for (let i = 0; i < orders.length; i++) {  //Loop through orders
      let order = orders[i]
      let items = JSON.parse(order.items)
      let orderQuantity = 0

      for (let x = 0; x < items.length; x++) {  //Loop through items in an order
        let item = items[x]
        let obj = {
          orderId: order.orderId,
          name: order.name,
          sku: item['sku'],
          quantity: item['quantity'],
          fulfillment_date: order.fulfillment_date,
          fulfillment_method: order.fulfillment_method,
          location: order.location,
          allergy_info: order.allergy_info,
          delivery_notes: order.delivery_notes,
          orderQuantity: orderQuantity += item['quantity']
        }
        masterOrders.push(obj)
      } 


    }
    let object = { data: masterOrders }

    return object
    }


    if (params.filter === 'pickup' || params.filter === 'delivery') {
      if (params.day != 'all') {
        var orders = await Database
          .raw(`SELECT * FROM orders WHERE fulfillment_date BETWEEN "${params.start}" AND "${params.end}" AND fulfillment_day = "${params.day}" AND fulfillment_method = "${params.filter}";`)
      } else {
        var orders = await Database
          .raw(`SELECT * FROM orders WHERE fulfillment_date BETWEEN "${params.start}" AND "${params.end}" AND fulfillment_method = "${params.filter}";`)
      }
    } else {
      if (params.day != 'all') {
        var orders = await Database
          .raw(`SELECT * FROM orders WHERE fulfillment_date BETWEEN "${params.start}" AND "${params.end}" AND fulfillment_day = "${params.day}";`)
      } else {
        var orders = await Database
          .raw(`SELECT * FROM orders WHERE fulfillment_date BETWEEN "${params.start}" AND "${params.end}";`)
      }
    }

    var object = { data: orders[0] }

    if (params.filter) {

      if (params.filter === 'sku') {
        let skuList = []
        let dates = []
        for (let i = 0; i < object.data.length; i++) {
          dates.push(moment(object.data[i].fulfillment_date).format('YYYY-MM-DD'))
        }
        dates = [...new Set(dates)];
        for (let i = 0; i < dates.length; i++) {
          skuList.push({ date: moment(dates[i]).format('YYYY-MM-DD'), skus: [] })
        }

        for (let i = 0; i < object.data.length; i++) {
          let items = JSON.parse(object.data[i].items)
          for (let x = 0; x < items.length; x++) {
            for (let y = 0; y < dates.length; y++) {
              if (moment(object.data[i].fulfillment_date).format('YYYY-MM-DD') === skuList[y].date) {
                skuList[y].skus.push({ name: items[x].name, quantity: items[x].quantity, sku: items[x].sku, date: skuList[y].date })
              }
            }
          }
        }
        for (let i = 0; i < skuList.length; i++) {
          skuList[i].skus = await this.checkDuplicateInObject('name', skuList[i].skus)
        }
        let skusSplit = []

        for (let i = 0; i < skuList.length; i++) {
          skusSplit.push(skuList[i].skus)

        }
        let skusMerged = [].concat.apply([], skusSplit);

        var object = { data: skusMerged }
        return object
        return response.send(object)
      }
    }
    return response.send(object)
  }


  async getFilteredOrders(filter, value) {
    const orders = await Database
      .table('orders')
      .where(filter, value)
      .select()
    return orders
  }

  async getFilteredOrdersMultiple(filter1, value1, filter2, value2) {
    const orders = await Database
      .table('orders')
      .where(filter1, value1)
      .where(filter2, value2)
      .select()
    return orders
  }

  async getDashboard({ request, response, view, session, auth }) {
    const allOrders = await Database
      .select()
      .table('orders')
    const lastWeekOrders = await this.getFilteredOrders('creation_week', dateCodes.previous)
    const currentOrders = await this.getFilteredOrders('creation_week', dateCodes.current)
    const nextWeekOrders = await this.getFilteredOrders('creation_week', dateCodes.next)
    const allMondayOrders = await this.getFilteredOrders('fulfillment_day', 'monday')

    const thisMondayOrders = await this.getFilteredOrdersMultiple('fulfillment_day', 'monday', 'fulfillment_week', dateCodes.next)

    return view.render('layout.admin.dashboard', { allOrders, lastWeekOrders, currentOrders, allMondayOrders, thisMondayOrders })
  }

  async updateItems() {
    const path = Helpers.appRoot()

    try {
      //Beware Stripe api defaults to limit of 10 products when doing a listing.
      var products = await stripe.products.list({ limit: 100000 })
      var prod = products.data

      for (var i = 0; i < prod.length; i++) {
        var sku = await stripe.skus.list(
          { product: prod[i].id }
        )
        prod[i].skus = sku
      }

      await Drive.put(`${path}/products.json`, JSON.stringify(prod))
    } catch (error) {
      return error
    }
    return 'success'
  }

  async publishItems({ response }) {
    var res = await this.updateItems()
    return response.send(res)
  }

  /**
   *  We need to check whether a user already has an account and give them some sort of feedback
   *  A get request can be made to this method to find out whether a user exists or not.
   */
  async checkExistingUser({ request, response }) {
    const { email } = request.all()

    var existingDb = await Database
      .table('users')
      .where('email', email)
      .limit(1)

    return response.send(parseInt(existingDb.length))
  }
  async importStripeProducts({ request, response }) {

    const path = Helpers.appRoot()
    var obj = await Drive.get(`${path}/products.json`, 'utf-8')
    obj = JSON.parse(obj)
    for (var i = 0; i < obj.length; i++) {
      var parent = obj[i]

      var product = await stripe.products.create({
        name: parent.name,
        type: 'good',
        description: parent.description,
        id: parent.id,
        attributes: parent.attributes,
        metadata: parent.metadata,
      })
      for (var x = 0; x < obj[i].skus.data.length; x++) {
        var sku = obj[i].skus.data[x]
        stripe.skus.create({
          product: sku.product,
          id: sku.id,
          price: sku.price,
          currency: 'usd',
          inventory: sku.inventory,
          image: sku.image,
          attributes: sku.attributes,
          metadata: sku.metadata
        })
      }
    }
    return response.send('Success!')

  }

  async viewForms({ params, response }) {
    const form_id = params.form_id
    const form = await Database
      .table('contact_form')
      .where('form_id', form_id)

    return response.send(form)
  }


  async updateHowItWorks({ request, response }) {

    const resourcesPath = Helpers.resourcesPath()
    const { id, content } = request.all()

    const template = await Drive.get(`${resourcesPath}/views/how-it-works.edge`, 'utf-8')

    const $ = cheerio.load(template, {
      decodeEntities: false,
      xmlMode: true,
      recognizeSelfClosing: false

    })

    $('#span1').html(content)

    await Drive.put(`${resourcesPath}/views/how-it-works.edge`, $.html())
  }


  async fulfillOrder({ params, response, session }) {

    try {
      var orderId = params.orderId
      orderId = orderId.split(',')
      console.log(orderId.length >= 1)
      if (orderId.length >= 1) {
        for (var i = 0; i < orderId.length; i++) {
          await Database
            .table('orders')
            .where('orderId', orderId[i])
            .update('order_status', 'fulfilled')
          var mesg = `Order ${orderId} marked as fulfilled.`
          session.flash({ status: mesg })
        }
        return response.redirect('back')
      } else {
        for (var i = 0; i < orderId.length; i++) {
          var update = await Database
            .table('orders')
            .where('orderId', orderId)
            .update('order_status', 'fulfilled')
          var mesg = `Order ${orderId} marked as fulfilled.`
          session.flash({ status: mesg })
          return response.redirect('back')
        }
      }


      return response.redirect('back')

    } catch (e) {
      var mesg = `Unable to mark ${orderId} as fulfilled.`
      session.flash({ error: mesg })
      return response.redirect('back')

    }


  }

  async listLocations({ view, response }) {
    var stores = await Database
      .from('locations')
    return view.render('layout.admin.locations', { stores })
  }


  async insertLocation(description, street, city, state, zip, opens, closes, coords) {
    coords = JSON.stringify(coords)

    const insert = await Database

      .table('locations')
      .insert({
        name: description,
        description: description,
        street_addr: street,
        city: city,
        state: state,
        zip: zip,
        opens: opens,
        closes: closes,
        coordinates: coords
      })
  }

  async addLocations({ request, response }) {
    const { description, street, city, state, opens, closes } = request.all()
    try {
      opencage.geocode({ q: `${street} ${city} ${state}` }).then(data => {
        if (data.status.code == 200) {
          if (data.results.length > 0) {
            var place = data.results[0]
            var coords = []
            var zip = place.components.postcode.slice(0, 5)
            coords.push(JSON.stringify(place.geometry.lng))
            coords.push(JSON.stringify(place.geometry.lat))
            var insert = this.insertLocation(description, street, city, state, zip, opens, closes, coords)
            return

            console.log(place.geometry);
          }
        } else if (data.status.code == 402) {
          console.log('hit free-trial daily limit');
          console.log('become a customer: https://opencagedata.com/pricing');
        } else {
          // other possible response codes:
          // https://opencagedata.com/api#codes
          console.log('error', data.status.message);
        }
      }).catch(error => {
        console.log('error', error.message);
      });
      return response.redirect('back')
    } catch (e) {
      return response.send({ 'error': 'error' })
    }

  }

  async deleteLocations({ request, response, params }) {
    var id = params.id
    const update = await Database
      .table('locations')
      .delete()
      .where('id', id)

    return redirect('/admin/locations')

  }
  async updateLocations({ view, request, params, response }) {

    var obj = {}
    for (let [key, value] of Object.entries(request.all())) {
      obj[key] = value
    }
    delete obj['_csrf']

    await Database
      .table('locations')
      .where('id', params.id)
      .update(obj)
    return response.redirect('back')
  }

  async importProducts({ view, request, response }) {
    var products = await Drive.get('/tmp/products.csv')

    for (var i = 0; i < products.length; i++) {
      var prod = products[i]
      var product = await stripe.products.create({
        name: prod.name,
        type: 'good',
        description: prod.description,
        id: prod.id,
        attributes: ['size'],
        metadata: {
          primary_category: prod.metadata.primary_category
        }
      }, function (err, product) {
        // Now that primary product is created, we need to create skus
        // Start with the parent item

        for (var x = 1; x < products.skus.data.length; x++) {
          var sku = products.skus.data.length[x]
          var size = sku.size
          size = size.toLowerCase().replace(/ /g, '_')

          stripe.skus.create({
            product: products[i].id,
            id: sku.id + '_' + size,
            price: parseInt(price),
            currency: 'usd',
            inventory: { type: 'finite', quantity: 500 },
            image: sku.image,
            attributes: {
              size: size
            },
            metadata: {
              category: sku.category,
              size: size,
              fats: sku.metdata.fats,
              carbs: sku.metadata.carbs,
              proteins: sku.metadata.proteins,
              calories: sku.metadata.calories
            },
          })
        }

      });
    }

    return response.send(JSON.parse(products))
    // var importFile = await Drive.get('/tmp/products.csv', 'utf-8')
    // importFile = importFile.split('\n')
    // var products = await stripe.products.list()
    // var file = await Drive.put('/tmp/products.csv', JSON.stringify(products.data))

    // return response.send(file)
  }

  async listCoupons({ view, response }) {
    const coupons = await stripe.coupons.list()
    return view.render('admin.coupons', { coupons })
  }

  async listCustomers({ view }) {

    // Grab all customers from Stripe
    var customers = await stripe.customers.list()
    customers = customers.data

    // Initialize empty variable to hold user's lifetime spending
    var totalSpend = 0

    // For each customer, pull a list of their orders.
    for (var i = 0; i < customers.length; i++) {
      var order = await stripe.orders.list({
        customer: customers[i].id,
      })

      // Loop over all orders for a user and grab the total amounts
      for (var x = 0; x < order.data.length; x++) {
        if (order.data[i] && order.data[i].amount) {
          totalSpend += order.data[i].amount
        }
      }

      // Add the lifetime spending for the customer onto customer object
      customers[i].totalSpend = totalSpend
      // Add customers most recent order to their object
      customers[i].recent_order = order.data[0]
    }

    return view.render('admin.customers', { customers })
  }

  async showItems({ view, response }) {

    const products = await Database
      .table('products')
      .select('*')
    return view.render('admin.items', { items: products })
  }

  async showItemsFiltered({ request, response, session, view, params }) {
    const { category } = params
    const products = await Database
      .table('products')
      .where('category', category)
    return view.render('admin.items', { items: products })
  }
  async createSku(product, id, price, sku_image, calories = 0, carbs = 0, fats = 0, proteins = 0, sugars = 0, label) {
    if (!id) {
      return
    }
    price = price.replace('.', '')
    if (price.length == 2) {
      price += '0'
    }
    var sku = await stripe.skus.create({
      product: product,
      id: id,
      price: parseInt(price),
      currency: 'usd',
      attributes: { 'style': id }, // Needed to create multiple skus under single product with current Stripe API
      inventory: {
        type: 'finite',
        quantity: 9000,
      },
      ...(sku_image && { image: sku_image }),
      metadata: {
        calories,
        carbs,
        proteins,
        fats,
        sugars,
        label
      }

    })

    return sku
  }

  async updateSku(product, id, price, sku_image, calories = 0, carbs = 0, fats = 0, proteins = 0, sugars = 0) {
    if (!id) {
      return
    }
    price = price.replace('.', '')
    if (price.length == 2) {
      price += '0'
    }
    var sku = await stripe.skus.update(id, {
      price: parseInt(price),
      ...(sku_image && { image: sku_image }),
      metadata: {
        calories,
        carbs,
        proteins,
        fats,
        sugars
      }

    })

    return sku
  }

  async addItem({ request, response, session }) {

    const { primary_img, product, product_id, description, nutrition_label } = request.all()
    const { name, price, label, category, macros, variations } = product
    let cloudinaryPath = 'https://res.cloudinary.com/themurphs/'

    const newProduct = await Database
      .table('products')
      .insert({
        active: 1,
        description,
        name,
        label,
        macros,
        category,
        variations,
        skus: product_id,
        images: cloudinaryPath + primary_img,
        nutrition_label: cloudinaryPath + nutrition_label,
        price
      })

    if (newProduct) {
      session.flash({ 'status': 'Product added successfully' })
      return response.redirect('/admin/products')
    } else {
      session.flash({ 'error': 'There was an error saving your item.  Please try again' })
      return response.redirect('back')
    }

  }

  async oldAddItem({ request, response }) {

    const { parent_product: product, sku0, sku1, sku2, sku3 } = request.all()

    try {

      try {
        let query = await stripe.products.retrieve(product.product_id)
        console.log('product exists')
        let prod = await stripe.products.update(product.product_id, {
          name: product.name,
          description: product.description,
          metadata: {
            primary_category: product.category,
          }
        })


        var resp = await this.updateSku(product.product_id, sku0.sku_id, sku0.price, sku0.image ? sku0.image : product.primary_img, sku0.calories, sku0.carbs, sku0.fats, sku0.proteins, sku0.sugars)
        resp += sku1 ? await this.updateSku(product.product_id, sku1.sku_id, sku1.price, sku1.image ? sku1.image : product.primary_img, sku1.calories, sku1.carbs, sku1.fats, sku1.proteins, sku1.sugars, sku1.label) : null
        resp += sku2 ? await this.updateSku(product.product_id, sku2.sku_id, sku2.price, sku2.image ? sku2.image : product.primary_img, sku2.calories, sku2.carbs, sku2.fats, sku2.proteins, sku2.sugars, sku2.label) : null
        resp += sku3 ? await this.updateSku(product.product_id, sku3.sku_id, sku3.price, sku3.image ? sku3.image : product.primary_img, sku3.calories, sku3.carbs, sku3.fats, sku3.proteins, sku3.sugars, sku3.label) : null
        resp += sku4 ? await this.updateSku(product.product_id, sku4.sku_id, sku4.price, sku4.image ? sku4.image : product.primary_img, sku4.calories, sku4.carbs, sku4.fats, sku4.proteins, sku4.sugars, sku4.label) : null
        resp += sku5 ? await this.updateSku(product.product_id, sku5.sku_id, sku5.price, sku5.image ? sku5.image : product.primary_img, sku5.calories, sku5.carbs, sku5.fats, sku5.proteins, sku5.sugars, sku5.label) : null
        resp += sku6 ? await this.updateSku(product.product_id, sku6.sku_id, sku6.price, sku6.image ? sku6.image : product.primary_img, sku6.calories, sku6.carbs, sku6.fats, sku6.proteins, sku6.sugars, sku6.label) : null
        resp += sku7 ? await this.updateSku(product.product_id, sku7.sku_id, sku7.price, sku7.image ? sku7.image : product.primary_img, sku7.calories, sku7.carbs, sku7.fats, sku7.proteins, sku7.sugars, sku7.label) : null
        resp += sku8 ? await this.updateSku(product.product_id, sku8.sku_id, sku8.price, sku8.image ? sku8.image : product.primary_img, sku8.calories, sku8.carbs, sku8.fats, sku8.proteins, sku8.sugars, sku8.label) : null

        console.log(resp)
      } catch (error) {


        let prod = await stripe.products.create({
          name: product.name,
          type: 'good',
          description: product.description,
          id: product.product_id,
          attributes: ['style'],
          metadata: {
            primary_category: product.category,
          }
        })


        var resp = await this.createSku(product.product_id, sku0.sku_id, sku0.price, sku0.image ? sku0.image : product.primary_img, sku0.calories, sku0.carbs, sku0.fats, sku0.proteins, sku0.sugars, sku0.label)
        resp += sku1 ? await this.createSku(product.product_id, sku1.sku_id, sku1.price, sku1.image ? sku1.image : product.primary_img, sku1.calories, sku1.carbs, sku1.fats, sku1.proteins, sku1.sugars, sku1.label) : null
        resp += sku2 ? await this.createSku(product.product_id, sku2.sku_id, sku2.price, sku2.image ? sku2.image : product.primary_img, sku2.calories, sku2.carbs, sku2.fats, sku2.proteins, sku2.sugars, sku2.label) : null
        resp += sku3 ? await this.createSku(product.product_id, sku3.sku_id, sku3.price, sku3.image ? sku3.image : product.primary_img, sku3.calories, sku3.carbs, sku3.fats, sku3.proteins, sku3.sugars, sku3.label) : null
        resp += sku4 ? await this.createSku(product.product_id, sku4.sku_id, sku4.price, sku4.image ? sku4.image : product.primary_img, sku4.calories, sku4.carbs, sku4.fats, sku4.proteins, sku4.sugars, sku4.label) : null
        resp += sku5 ? await this.createSku(product.product_id, sku5.sku_id, sku5.price, sku5.image ? sku5.image : product.primary_img, sku5.calories, sku5.carbs, sku5.fats, sku5.proteins, sku5.sugars, sku5.label) : null
        resp += sku6 ? await this.createSku(product.product_id, sku6.sku_id, sku6.price, sku6.image ? sku6.image : product.primary_img, sku6.calories, sku6.carbs, sku6.fats, sku6.proteins, sku6.sugars, sku6.label) : null
        resp += sku7 ? await this.createSku(product.product_id, sku7.sku_id, sku7.price, sku7.image ? sku7.image : product.primary_img, sku7.calories, sku7.carbs, sku7.fats, sku7.proteins, sku7.sugars, sku7.label) : null
        resp += sku8 ? await this.createSku(product.product_id, sku8.sku_id, sku8.price, sku8.image ? sku8.image : product.primary_img, sku8.calories, sku8.carbs, sku8.fats, sku8.proteins, sku8.sugars, sku8.label) : null

      }

      return response.send({ status: 'success' })

    } catch (e) {
      return response.send(e)
    }





  }

  async deleteCoupon({ request, response }) {
    const { id } = request.all()
    var status = await stripe.coupons.del(id)

    return response.send(status)
  }


  async addCoupon({ request, response }) {
    // const couponData = request.only(['percentage', 'coupon_name'])

    const { percent_off, amount_off, coupon_name, coupon_desc, coupon_type, amount, redeem_by } = request.all()

    try {
      const status = await this.createCoupon(coupon_type, amount, encodeURI(coupon_name), redeem_by)
      return response.send(status)
    } catch (e) {
      return response.send(e.message)
    }
  }

  createCoupon(ctype, amount, name, redeem_by) {
    if (ctype == 'percent_off') {
      return new Promise((resolve, reject) => {
        stripe.coupons.create({
          percent_off: amount,
          duration: 'once',
          id: encodeURI(name),
          ...(redeem_by && { redeem_by: redeem_by })
        }, (err) => {
          if (err) { return reject(err) }
          return resolve('Coupon Created')
        });
      })
    } else {
      amount = (amount * 100)
      return new Promise((resolve, reject) => {
        stripe.coupons.create({
          amount_off: amount,
          duration: 'once',
          currency: 'usd',
          id: encodeURI(name),
          ...(redeem_by && { redeem_by: redeem_by })
        }, (err) => {
          if (err) { return reject(err) }
          return resolve('Coupon Created')
        });
      })
    }

  }
}

module.exports = AdminController
