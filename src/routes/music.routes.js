const express = require("express");
const createMusic = require("../controllers/music.controller");
const router = express.Router();

router.post("/music", createMusic);

module.exports = router;
