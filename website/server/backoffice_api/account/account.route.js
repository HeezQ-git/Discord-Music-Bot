const express = require("express");
const router = express.Router();
const accountService = require("./service/account");

router.post("/api/account/activate", accountService.accountActivate);
router.post(
    "/api/account/check-password-reset",
    accountService.checkPasswordReset
);
router.post("/api/account/change-password", accountService.changePassword);

module.exports = router;
