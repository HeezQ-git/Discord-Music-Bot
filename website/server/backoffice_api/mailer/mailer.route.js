const express = require('express');
const router = express.Router();
const mailerService = require('./service/mailer');

router.post('/api/backoffice/mailer/newPendingUser', mailerService.newPendingUser);
router.post('/api/backoffice/mailer/sendEmail', mailerService.sendEmail);
router.post('/api/backoffice/mailer/sendForgetPassword', mailerService.sendForgetPassword);

module.exports = router;
