let express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require('../controllers/UserController');
const User = require("../models/User");

//HOME
router.get('/', HomeController.index);

//USERS
router.get('/user', UserController.index);
router.get('/user/:id', UserController.findUser);
router.post('/user', UserController.create);
router.put('/user', UserController.edit);
router.delete('/user/:id', UserController.remove);

//RECOVER PASSWORD
router.post('/recoverpassword', UserController.recoverPassword);

module.exports = router;