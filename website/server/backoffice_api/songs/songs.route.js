const express = require("express");
const router = express.Router();
const songsService = require("./service");

router.get("/api/backoffice/songs", songsService.getSongs);
router.post("/api/backoffice/filloutData", songsService.filloutData);

module.exports = router;
