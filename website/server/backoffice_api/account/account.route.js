const express = require('express');
const router = express.Router();
const accountService = require('./service/account');

router.post('/api/backoffice/account/activate', accountService.accountActivate);

module.exports = router;
