'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.get('/checkout', 'ItemController.showCheckout')

Route.get('/', 'HomeController.index').as('welcomePage')
Route.get('/how-it-works', async({view}) => view.render('how-it-works'))

Route.post('/how-it-works/update', 'AdminController.updateHowItWorks')
Route.get('/orders/test', 'Auth/AuthController.testOrder')

Route.get('/api/stores/all', 'HomeController.showStores')

Route.get('/item/add/:itemId', 'ItemController.editItem')
Route.post('/item/add/:itemId', 'ItemController.updateItem')

Route.get('/item/add', 'ItemController.addItemView')
Route.post('/item/add', 'ItemController.addItem')

Route.get('/login', 'Auth/AuthController.showLogin').as('loginPage')
Route.post('/login', 'Auth/AuthController.postLogin').as('login.store')
Route.get('/logout', 'Auth/AuthController.logout').as('logout')

Route.get('/manage/deliveries/:zip/', 'Auth/AuthController.showDeliveryOptions')
Route.get('/manage/pickups/:zip/:radius', 'Auth/AuthController.showPickupOptions')
/**
 * 
 * This will be the first point of contact with the customer
 * We need to get their preference for pickup/delivery and save that to the session.
 * Then we need to show them a modal asking for name and zip.
 */

Route.get('/password/reset', 'Auth/PasswordController.showResetForm').as('reset.form')
Route.post('/password/email', 'Auth/PasswordController.sendResetLinkEmail').as('send.reset.email')
Route.get('/password/token/reset/:token', 'Auth/PasswordController.showResetView')
Route.post('/password/reset', 'Auth/PasswordController.reset').as('reset.password')

Route.get('/contact', 'ContactController.index').as('contact.show')
Route.post('/contact', 'ContactController.sendMessage').as('contact.send')
Route.post('/checkout/stripe', 'CheckoutController.stripeCheckout')
Route.post('/checkout/express', 'CheckoutController.expressCheckout')
Route.post('/checkout/paypal', 'CheckoutController.paypalCheckout')

/**
 * Social Login Route
 */

Route.group(() => {

  Route.get('/account', 'Auth/AuthController.viewProfile').as('user.account')
  Route.post('/account/fulfillmethod/update', 'AccountController.updateFulfillmentMethod')
  Route.post('/account/updateOrderPref', 'AccountController.updateOrderPref')
  Route.post('/account/profile', 'AccountController.update').as('account.update')
  Route.post('/account/photo', 'AccountController.uploadAvatar').as('account.updateAvatar')
  Route.post('/account/password', 'AccountController.changePassword').as('account.updatePwd')
  Route.get('/account/unlink/:provider', 'AccountController.unlinkSocialMediaAccount').as('unlink.sm')
  Route.get('/account/delete', 'AccountController.destroy').as('account.delete')
  Route.post('/account/billing/update', 'AccountController.updateBilling')

})

Route.get('/api', async ({ view }) => view.render('api'))

Route.get('/checkout/coupon/apply/:coupon', 'CheckoutController.applyCoupon')

Route.get('/menu', 'ItemController.listItems').as('menu.items')
/* Admin route group.  All admin routes should go here.  They are inspected by Middleware/AdminAccess
*  which checks to make sure that the user is logged in and that they have the appropriate permissions
*/
Route.group(() => {
  Route.get('/admin/dashboard', async({view}) => view.render('layout.admin.dashboard'))

  Route.get('/products/add', async ({ view }) => view.render('admin.items-new'))

  
  /* Coupon management routes */
  Route.get('/admin/coupon', 'AdminController.listCoupons')
  Route.post('/admin/coupon/add', 'AdminController.addCoupon')
  Route.get('/admin/customers', 'AdminController.listCustomers')
  Route.get('/admin/products', 'AdminController.showItems')
  Route.post('admin/items/edit/:sku', 'ItemController.updateItem')
  Route.post('/admin/items/add', 'AdminController.test')
  Route.get('/admin/orders', 'OrderController.viewOrdersAdmin')
  Route.get('/admin/orders/fulfill/:orderId', 'AdminController.fulfillOrder')
  Route.get('/admin/orders/:orderId', 'OrderController.viewOrderById')
  Route.get('/products/edit/:sku', 'ItemController.listItemsAdmin')
  Route.get('/item/delete/:itemId', 'ItemController.deleteItem')
  Route.get('/products/hide/:itemId', 'ItemController.hideItem')
  Route.get('/products/show/:itemId', 'ItemController.showItem')
  Route.get('/admin/import', 'AdminController.importProducts')
  Route.get('/admin/locations', 'AdminController.listLocations')
  Route.post('/admin/locations/update/:id', 'AdminController.updateLocations')

}).middleware(['admin'])