const express = require("express");
const router = express.Router();
const loginService = require("./service/login");

router.post("/api/login", loginService.loginUser);
router.post("/api/login/google-user", loginService.loginGoogleUser);
router.post("/api/login/check-session", loginService.checkSession);
router.post("/api/login/check-user", loginService.checkUser);
router.post("/api/login/check-email", loginService.checkEmail);

module.exports = router;
