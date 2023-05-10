/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

/*Route.get('/', async ({ view }) => {
  return view.render('welcome')
});*/
Route.get('/', 'AuthController.index').as('login');
Route.get('/login', 'AuthController.index');
Route.post('/check/login', 'AuthController.checkLogin').as('login.check');
Route.get('/logout', 'AuthController.logout').as('auth.logout');

//Forgot password
Route.get('/forgot-password', 'AuthController.forgotPassword').as('forgot.password');
Route.post('/resetlink-send', 'AuthController.resetLinkSend').as('resetlink.send');

//Reset Password
Route.get('/reset-password/:link', 'AuthController.resetPassword').as('reset.password');
Route.post('/reset-password', 'AuthController.resetingPassword').as('reseting.password');

Route.group(() => {
  Route.get('/dashboard', 'DashboardController.index').as('dashboard');
})
.middleware("isAdmin")
.middleware("auth:web");
