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

// Items by category id

/*
|---------------------------------------------------------------------------
| Backend/Admin routes
|---------------------------------------------------------------------------
*/

Route.get('/checkout/test', async ({ view }) => view.render('menu.checkout'))

Route.get('/admin/items', 'AdminController.showItems')
Route.get('/admin/categories', 'AdminController.showCategories')
Route.post('/admin/categories/edit/:cat_id', 'CategoryController.update')
Route.post('/admin/categories/list/:cat_id', 'CategoryController.listItems')
Route.get('/admin/orders', 'OrderController.viewOrdersAdmin')


/**
 * 
 * This route now has to trigger part two of user registration.
 * Now we need to capture 
 */
Route.get('/checkout', 'CheckoutController.startCheckout')
Route.post('/cart/addItem', 'ItemController.addToCart')
Route.get('/cart/clear', 'ItemController.clearCart')
Route.get('/cart/sub/:cartPos', 'ItemController.subCart')
Route.get('/cart/remove/:cartPos', 'ItemController.removeItem')
Route.get('/', 'ItemController.showMenu')

// Route.get('/', 'HomeController.index').as('welcomePage')
Route.get('/menu/all', 'ItemController.showMenu')
Route.get('/items/category/:cat_id', 'ItemController.list')
Route.get('/orders/test', 'Auth/AuthController.testOrder')
Route.get('/register', 'Auth/AuthController.showRegister').as('registerPage')
Route.post('/register/:reg_method', 'Auth/AuthController.updateCustomerAddress')

Route.get('/item/delete/:itemId', 'ItemController.deleteItem')
Route.get('/item/hide/:itemId', 'ItemController.hideItem')

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
Route.post('/register', 'Auth/AuthController.postGuestRegistration')

Route.get('/password/reset', 'Auth/PasswordController.showResetForm').as('reset.form')
Route.post('/password/email', 'Auth/PasswordController.sendResetLinkEmail').as('send.reset.email')
Route.get('/password/token/reset/:token', 'Auth/PasswordController.showResetView')
Route.post('/password/reset', 'Auth/PasswordController.reset').as('reset.password')

Route.get('/contact', 'ContactController.index').as('contact.show')
Route.post('/contact', 'ContactController.sendMessage').as('contact.send')
Route.post('/checkout/stripe', 'CheckoutController.stripeCheckout')

/**
 * Social Login Route
 */

Route.group(() => {
  Route.get('/account', 'AccountController.edit').as('user.account')
  Route.post('/account/profile', 'AccountController.update').as('account.update')
  Route.post('/account/photo', 'AccountController.uploadAvatar').as('account.updateAvatar')
  Route.post('/account/password', 'AccountController.changePassword').as('account.updatePwd')
  Route.get('/account/unlink/:provider', 'AccountController.unlinkSocialMediaAccount').as('unlink.sm')
  Route.get('/account/delete', 'AccountController.destroy').as('account.delete')

})

Route.get('/api', async ({ view }) => view.render('api'))
