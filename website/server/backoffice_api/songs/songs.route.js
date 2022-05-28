const express = require("express");
const { checkToken, addAction } = require("../_protector");
const router = express.Router();
const songsService = require("./service");

router.get("/api/songs", addAction, songsService.getSongs);
router.post("/api/songs/fillout-data", checkToken, songsService.filloutData);
router.post("/api/songs/update-songs", checkToken, songsService.updateSongs);

module.exports = router;
