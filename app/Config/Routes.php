<?php

namespace Config;

// Create a new instance of our RouteCollection class.
$routes = Services::routes();

// Load the system's routing file first, so that the app and ENVIRONMENT
// can override as needed.
if (file_exists(SYSTEMPATH . 'Config/Routes.php'))
{
	require SYSTEMPATH . 'Config/Routes.php';
}

/**
 * --------------------------------------------------------------------
 * Router Setup
 * --------------------------------------------------------------------
 */
$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setTranslateURIDashes(false);
$routes->set404Override();
$routes->setAutoRoute(true);

/*
 * --------------------------------------------------------------------
 * Route Definitions
 * --------------------------------------------------------------------
 */

// We get a performance increase by specifying the default
// route since we don't have to scan directories.

$routes->get('/', 'CustomerController::index');
$routes->get('/movies','CustomerController::index');
$routes->get('/movieDetail/(:num)','CustomerController::index');
$routes->get('/booking/(:num)','CustomerController::index');
$routes->get('/custBooking','CustomerController::index');
$routes->get('/custBookingDetail/(:num)','CustomerController::index');
$routes->post('/api/addCustomer','CustomerController::addCustomer');
$routes->post('/api/loginCustomer','CustomerController::loginCustomer');
$routes->get('/api/getCustSession','CustomerController::getCustSession');
$routes->get('/api/logoutCustomer','CustomerController::logoutCustomer');
$routes->get('/api/getEnabledBanners','CustomerController::getEnabledBanners');
$routes->get('/api/getShowingMovies','CustomerController::getShowingMovies');
$routes->get('/api/getUpcomingMovies','CustomerController::getUpcomingMovies');
$routes->get('/api/getPopularMovies','CustomerController::getPopularMovies');
$routes->post('/api/searchMovie','CustomerController::searchMovie');
$routes->get('/api/getMovieDetail/(:num)','CustomerController::getMovieDetail/$1');
$routes->get('/api/getShowing/(:num)','CustomerController::getShowing/$1');
$routes->get('/api/getSnacks','CustomerController::getSnacks');
$routes->post('/api/paymentSuccess','CustomerController::paymentSuccess');
$routes->get('/api/getPayments/(:num)','CustomerController::getPayments/$1');
$routes->get('/api/getPaymentDetail/(:num)','CustomerController::getPaymentDetail/$1');
$routes->get('/api/getQuickBook','CustomerController::getQuickBook');

$routes->get('/admin','AdminController::index');
$routes->post('/api/admin/add','AdminController::add');
$routes->post('/api/admin/login','AdminController::login');
$routes->get('/api/admin/list','AdminController::list');
$routes->get('/admin/dashboard','AdminController::index');
$routes->get('/admin/movies','AdminController::index');
$routes->get('/admin/experiences','AdminController::index');
$routes->get('/admin/movieDetail/(:num)','AdminController::index');
$routes->get('/admin/movieHall','AdminController::index');
$routes->get('/admin/hallDetail/(:num)','AdminController::index');
$routes->get('/admin/snacks','AdminController::index');
$routes->get('/admin/banners','AdminController::index');
$routes->get('/api/admin/session','AdminController::getSession');
$routes->get('/api/admin/getAdmin','AdminController::getAdmin');
$routes->post('/api/admin/addExperience','AdminController::addExperience');
$routes->get('/api/admin/getExperience','AdminController::getExperience');
$routes->delete('/api/admin/deleteExperience/(:num)','AdminController::deleteExperience/$1');
$routes->post('/api/admin/editExperience/(:num)','AdminController::editExperience/$1');
$routes->get('/api/admin/getGenre','AdminController::getGenre');
$routes->post('/api/admin/addGenre','AdminController::addGenre');
$routes->post('/api/admin/editGenre/(:num)','AdminController::editGenre/$1');
$routes->delete('/api/admin/deleteGenre/(:num)','AdminController::deleteGenre/$1');
$routes->post('/api/admin/addMovie','AdminController::addMovie');
$routes->get('/api/admin/getMovies','AdminController::getMovies');
$routes->post('/api/admin/editMovie/(:num)','AdminController::editMovie/$1');
$routes->delete('/api/admin/deleteMovie/(:num)','AdminController::deleteMovie/$1');
$routes->post('/api/admin/filterMovies','AdminController::filterMovies');
$routes->get('/api/admin/runSentimentScript','AdminController::runSentimentScript');
$routes->get('/api/admin/getMovie/(:num)','AdminController::getMovie/$1');
$routes->post('/api/admin/addHall','AdminController::addHall');
$routes->get('/api/admin/getHalls','AdminController::getHalls');
$routes->delete('/api/admin/deleteHall/(:num)','AdminController::deleteHall/$1');
$routes->post('/api/admin/editHall/(:num)','AdminController::editHall/$1');
$routes->get('/api/admin/getHall/(:num)','AdminController::getHall/$1');
$routes->post('/api/admin/getSchedule','AdminController::getSchedule');
$routes->post('/api/admin/getSchedulableMovies','AdminController::getSchedulableMovies');
$routes->post('/api/admin/addShowing','AdminController::addShowing');
$routes->post('/api/admin/addSnack','AdminController::addSnack');
$routes->get('/api/admin/getSnacks','AdminController::getSnacks');
$routes->post('/api/admin/editSnack/(:num)','AdminController::editSnack/$1');
$routes->delete('/api/admin/deleteSnack/(:num)','AdminController::deleteSnack/$1');
$routes->post('/api/admin/addBanner','AdminController::addBanner');
$routes->get('/api/admin/getBanners','AdminController::getBanners');
$routes->post('/api/admin/editBanner/(:num)','AdminController::editBanner/$1');
$routes->delete('/api/admin/deleteBanner/(:num)','AdminController::deleteBanner/$1');
$routes->get('/api/admin/getDashboardData','AdminController::getDashboardData');
$routes->post('/api/admin/getSnackSales','AdminController::getSnackSales');
$routes->post('/api/admin/getMovieSales','AdminController::getMovieSales');
$routes->get('/api/admin/getSentimentRecommendation','AdminController::getSentimentRecommendation');

/*
 * --------------------------------------------------------------------
 * Additional Routing
 * --------------------------------------------------------------------
 *
 * There will often be times that you need additional routing and you
 * need it to be able to override any defaults in this file. Environment
 * based routes is one such time. require() additional route files here
 * to make that happen.
 *
 * You will have access to the $routes object within that file without
 * needing to reload it.
 */
if (file_exists(APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php'))
{
	require APPPATH . 'Config/' . ENVIRONMENT . '/Routes.php';
}
