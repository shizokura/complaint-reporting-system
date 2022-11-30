var express = require('express');
var router = express.Router();

const AccountController = require('../controllers/AccountController');
const AdminController = require('../controllers/AdminController');

// Guest
router.post('/login', AccountController.login);
router.post('/register', AccountController.register);
router.post('/verify', AccountController.verify);
router.post('/notify', AccountController.notify);

// Admin
router.post('/admin/list-users', AdminController.listUsers);
router.post('/admin/verify-user', AdminController.verifyUser);

module.exports = router;
