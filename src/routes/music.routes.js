const express = require("express");
const createController = require("../controllers/music.controller");

const multer=require("multer")
const upload=multer({
    storage:multer.memoryStorage()
})

const router = express.Router();

router.post("/upload",upload.single("music"), createController.createMusic);
router.post("/album",upload.single("album"),createController.createAlbum)

module.exports = router;
