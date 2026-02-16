const express = require("express");
const createController = require("../controllers/music.controller");
const authmiddleware=require("../middlewares/auth.middleware")
const multer=require("multer")
const upload=multer({
    storage:multer.memoryStorage()
})

const router = express.Router();

router.post("/upload",authmiddleware.authArtist,upload.single("music"), createController.createMusic);
router.post("/album",authmiddleware.authArtist,upload.single("album"),createController.createAlbum)
router.get("/",authmiddleware.authUser,createController.getAllMusic)
module.exports = router;
