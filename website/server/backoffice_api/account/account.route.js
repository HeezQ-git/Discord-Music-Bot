const express = require('express');
const router = express.Router();
const accountService = require('./service/account');

router.post('/api/backoffice/account/activate', accountService.accountActivate);
router.post('/api/backoffice/account/checkPasswordReset', accountService.checkPasswordReset);
router.post('/api/backoffice/account/changePassword', accountService.changePassword);

module.exports = router;
