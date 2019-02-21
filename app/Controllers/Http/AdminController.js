'use strict'
const Database = use('Database')
var stripe = require("stripe")("sk_test_ZmWaFEiBn0H63gNmfCacBolp");

class AdminController {

    async showItems ({ view }) {
        var prod = await stripe.products.list();
        prod = prod.data
        var categories = []
        console.log(prod.length)
        for (var i = 0; i < prod.length; i++) {
          categories.push(prod[i].metadata.primary_category)
        }
        console.log(categories)
        return view.render('admin.items', {items: prod, categories})
    }

    async showCategories ({ view }) {
        const categories = await Database
            .table('item_categories')
            .distinct('desc', 'id')

        return view.render('admin.categories.edit', {categories: categories})
    }

    async test ({request, response}) {
        var form = request.all()
        var prod = form.parent_product
        var id = prod.name.replace(/ /g, '_')
        id = id.toLowerCase()

        var sku = form['parent_product']

        var sku_id = id
        var price = String(sku.price).replace(".", "")
        if(price.length == 2) {
          price += '0'
        }

        if (sku.flavor !== '') {
            var attr = 'flavor'
        }
        if (sku.size !== '') {
            var attr = 'size'
        }
        if (sku.protein_type !== '') {
            var attr = 'protein_type'
        }

        var product = await stripe.products.create({
            name: prod.name,
            type: 'good',
            description: prod.description,
            id: id,
            attributes: [attr],
            metadata: {
                primary_category: sku.category
            }
          }, function(err, product) {
            // Now that primary product is created, we need to create skus
            // Start with the parent item
            var sku = form['parent_product']

            if (sku.flavor !== '') {
                var attr = 'flavor'
                var value = sku.flavor
            }
            if (sku.size !== '') {
                var attr = 'size'
                var value = sku.size
            }
            if (sku.protein_type !== '') {
                var attr = 'protein_type'
                var value = sku.protein_type
            }
            stripe.skus.create({
                product: id,
                id: sku_id + '_' + value.toLowerCase(),
                price: parseInt(price),
                currency: 'usd',
                inventory: {type: 'finite', quantity: 500},
                image: prod.primary_img,
                attributes: {
                    [attr]: value
                },
                metadata: {
                    category: sku.category,
                    [attr]: value,
                    fats: sku.fats,
                    carbs: sku.carbs,
                    proteins: sku.proteins,
                    calories: sku.calories
                },
              })
              for (var i = 1; i < Object.keys(form).length; i++) {
                var sku = form['variation_'+i]

                if (typeof sku.flavor !== 'undefined') {
                    var attr = 'flavor'
                    var value = sku.flavor
                }
                if (typeof sku.size !== 'undefined') {
                    var attr = 'size'
                    var value = sku.size
                }
                if (typeof sku.protein_type !== 'undefined') {
                    var attr = 'protein_type'
                    var value = sku.protein_type
                }

                stripe.skus.create({
                    product: id,
                    id: sku_id + '_' + value.toLowerCase(),
                    price: parseInt(price),
                    currency: 'usd',
                    inventory: {type: 'finite', quantity: 500},
                    image: prod.primary_img,
                    attributes: {
                        [attr]: value
                    },
                    metadata: {
                        category: sku.category,
                        [attr]: value,
                        fats: sku.fats,
                        carbs: sku.carbs,
                        proteins: sku.proteins,
                        calories: sku.calories
                    },
                  })
              }
        });
          return response.send(product)
    }
}

module.exports = AdminController
