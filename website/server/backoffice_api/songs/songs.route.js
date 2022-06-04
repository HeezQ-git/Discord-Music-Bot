const express = require("express");
const { checkToken, addAction } = require("../_protector");
const router = express.Router();
const songsService = require("./service");

router.get("/api/songs", addAction, songsService.getSongs);
router.post("/api/songs/get-song", checkToken, songsService.getSong);
router.post("/api/songs/fillout-data", checkToken, songsService.filloutData);
router.post("/api/songs/update-songs", checkToken, songsService.updateSongs);
router.post("/api/songs/add-song", checkToken, songsService.addSong);
router.post("/api/songs/delete-song", checkToken, songsService.deleteSong);
router.post("/api/songs/edit-song", checkToken, songsService.editSong);

module.exports = router;
