const express = require('express');
const router = express.Router();
const loginService = require('./service/login');

router.post('/api/backoffice/login', loginService.loginUser);
router.post('/api/backoffice/login/googleUser', loginService.loginGoogleUser);
router.post('/api/backoffice/login/checkUser', loginService.checkUser);
router.post('/api/backoffice/login/checkEmail', loginService.checkEmail);

module.exports = router;
