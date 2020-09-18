let express = require("express")
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require('../controllers/UserController');
let AdminAuth = require('../middleware/AdminAuth');

//HOME
router.get('/', AdminAuth, HomeController.index);

//USERS
router.get('/user', AdminAuth, UserController.index);
router.get('/user/:id', AdminAuth, UserController.findUser);
router.post('/user', AdminAuth, UserController.create);
router.put('/user', AdminAuth, UserController.edit);
router.delete('/user/:id', AdminAuth, UserController.remove);

//RECOVER PASSWORD
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword/:token', UserController.changePassword);

//LOGIN
router.post('/login', UserController.login);

module.exports = router;