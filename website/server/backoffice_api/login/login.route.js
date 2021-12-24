const express = require('express');
const router = express.Router();
const loginService = require('./service/login');

router.post('/api/backoffice/login', loginService.loginUser);

module.exports = router;
