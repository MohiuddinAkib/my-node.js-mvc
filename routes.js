const Route = require('./app/libraries/Route');
// Init route
const router = new Route();

router.get('/', 'HomeController@index');
router.get('/home/about/:id/:name', 'HomeController@about');

router.get('/about', 'AboutController@index');
router.get('/about/create', 'AboutController@create');
router.post('/about/store', 'AboutController@store');

router.get('/user', 'UserController@index');
router.get('/user/create', 'UserController@create');
router.post('/user/store', 'UserController@store');

/**
 * @description this should be always put to last
 *
 */
// router.get('/:id/:name', function(id, name) {
//   console.log('function', id, name);
// });

module.exports = router;
