const express = require("express");
const router = express.Router();
const mailerService = require("./service/mailer");

router.post("/api/mailer/new-pending-user", mailerService.newPendingUser);
router.post("/api/mailer/send-email", mailerService.sendEmail);
router.post(
    "/api/mailer/send-forget-password",
    mailerService.sendForgetPassword
);

module.exports = router;
