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
Route.get('/test/fulfill', 'OrderController.testFulfill')

Route.get('/checkout', 'ItemController.showCheckout')
Route.get('/checkout/confirmation', 'OrderController.showConfirmation')
Route.get('/sw.js', 'PwaController.serviceWorker')
Route.get('/manifest.json', 'PwaController.manifest')


Route.post('/how-it-works/update', 'AdminController.updateHowItWorks')

Route.get('/api/stores/all', 'HomeController.showStores')

/**
 * Static page routes
 */
Route.get('/locations', 'HomeController.showStoresView')
Route.get('/about', async({view}) => view.render('about'))
Route.get('/', 'HomeController.index').as('welcomePage')
Route.get('/contact', async({view}) => view.render('contact'))
Route.get('/catering', async({view}) => view.render('catering'))
Route.get('/careers', async({view}) => view.render('careers'))
Route.get('/partnerships', async({view}) => view.render('partnerships'))

/**
 * 
 * Routes to handle contact and other information forms on static pages
 * 
 */

Route.post('/contact', 'FormController.contactForm')
Route.post('/catering', 'FormController.cateringForm')
Route.post('/careers', 'FormController.careersForm')
Route.post('/partnerships', 'FormController.partnershipsForm')


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

Route.post('/checkout/stripe', 'CheckoutController.stripeCheckout')
Route.post('/checkout/express', 'CheckoutController.expressCheckout')

/**
 * Social Login Route
 */

Route.group(() => {

  Route.get('/account', 'Auth/AuthController.viewProfile').as('user.account')
  Route.post('/account/fulfillmethod/update', 'AccountController.updateFulfillmentMethod')
  Route.post('/account/fulfill/day/update', 'AccountController.updateFulfillmentDay')
  Route.post('/account/updateOrderPref', 'AccountController.updateOrderPref')
  Route.post('/account/profile', 'AccountController.update').as('account.update')
  Route.post('/account/password', 'AccountController.changePassword').as('account.updatePwd')
  Route.get('/account/delete', 'AccountController.destroy').as('account.delete')
  Route.post('/account/billing/update', 'AccountController.updateBilling')

})

Route.get('/api', async ({ view }) => view.render('api'))

Route.get('/checkout/coupon/apply/:coupon', 'CheckoutController.applyCoupon')

Route.get('/api/user/check', 'AdminController.checkExistingUser')

Route.get('/menu', 'ItemController.listItems').as('menu.items').middleware(['analytics'])
Route.get('/menu/:categories/:filters', 'ItemController.listItems').as('menu.items').middleware(['analytics'])


Route.get('/menu/custom', 'ItemController.listCustomMeals')
/* Admin route group.  All admin routes should go here.  They are inspected by Middleware/AdminAccess
*  which checks to make sure that the user is logged in and that they have the appropriate permissions
*/
Route.group(() => {
  // Route.get('/admin/dashboard', 'AdminController.getDashboard')
  Route.get('/admin/dashboard', async({view}) => view.render('layout.admin.orders'))

  Route.get('/products/add', async ({ view }) => view.render('admin.items-new'))

  
  /* Coupon management routes */
  Route.get('/admin/coupon', 'AdminController.listCoupons')
  Route.post('/admin/coupon/add', 'AdminController.addCoupon')
  Route.post('/admin/coupon/delete', 'AdminController.deleteCoupon')
  Route.get('/admin/customers', 'AdminController.listCustomers')
  Route.get('/admin/products', 'AdminController.showItems')
  Route.get('/admin/products/filter/:category', 'AdminController.showItemsFiltered')
  Route.get('/admin/products/publish', 'AdminController.publishItems')
  Route.post('admin/items/edit/', 'ItemController.updateItem')
  Route.post('/admin/items/add', 'AdminController.addItem')
  Route.get('/admin/orders', 'OrderController.viewOrdersAdmin')
  Route.get('/admin/orders/fulfill/:orderId', 'AdminController.fulfillOrder')
  Route.post('/admin/orders/batch', 'OrderController.batchFulfill').as('batchFulfill')
  Route.get('/admin/orders/:orderId', 'OrderController.viewOrderById')
  //Route to handle cancel,refund of orders
  Route.post('/admin/orders/:orderId', 'OrderController.updateOrderById')
  Route.post('/admin/orders/update/refund', 'OrderController.postRefund')
  Route.get('/admin/products/edit/:sku', 'ItemController.listItemsAdmin')
  Route.get('/item/delete/:itemId', 'ItemController.deleteItem')
  Route.get('/admin/products/hide/:itemId', 'ItemController.hideItem')
  Route.get('/admin/products/show/:itemId', 'ItemController.showItem')
  Route.get('/admin/import', 'AdminController.importProducts')
  Route.get('/admin/locations', 'AdminController.listLocations')
  Route.get('/email/order/confirm/:id', 'OrderController.confirmationEmail')
  Route.post('/admin/locations', 'AdminController.addLocations')

  Route.post('/admin/locations/update/:id', 'AdminController.updateLocations')
  Route.post('/admin/locations/delete/:id', 'AdminController.deleteLocations')

  Route.get('/admin/forms/:form_id', 'AdminController.viewForms')
  Route.get('/admin/products/import', 'AdminController.importStripeProducts')

}).middleware(['admin'])
Route.post('/hooks/orders/created', 'StripeController.orderCreatedHook')
Route.get('/hooks/orders/created', 'StripeController.orderCreatedHook')

Route.get('/api/orders/filtered/date/:start/:end/:day/:filter', 'AdminController.filteredOrdersByDate')
Route.get('/api/orders/filtered/date/:start/:end/:day', 'AdminController.filteredOrdersByDate')
Route.get('/api/orders/cancel/:order/:charge/:user', 'AdminController.cancelOrder')