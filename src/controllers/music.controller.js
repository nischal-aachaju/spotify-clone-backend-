const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");
const albumModel=require("../models/album.model")
async function createMusic(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (decode.role !== "artist") {
      return res.status(403).json({
        message: "You don't have access to create music",
      });
    }
    const { title } = req.body;
    const file = req.file;

    const result = await uploadFile(file.buffer.toString("base64"));
    const music = await musicModel.create({
      uri: result.url,
      title,
      artist: decode.id,
    });

    res.status(200).json({
      message: "music create successfully",
      music: {
        id: music._id,
        uri: music.uri,
        title: music.title,
        artist: music.artist,
      },
    });
  }

  catch (err) {
    return res.status(401).json({
      message: "unauthorized access",
    });
  }
}


async function createAlbum(req, res) {
  const token = req.cookies.token

  if (!token) {
     return res.status(401).json({
      message: "Unauthorized access, please login"
    })
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET)
    if (decode.role !== "artist") {
      return res.status(403).json({
        message: "You don't have access to create album"
      })}
    const {title,musics }=req.body
    
    const album=await albumModel.create({
      title,
      artist:decode.id,
      musics:musics
    })
    res.status(201).json({
      message:"Album created successfully",
      album:{
        id:album._id,
        title:album.title,
        artist:album.artist,
        musics:album.musics
      }
    })

    

  }

  catch (err) {
    console.log(err);
    
    return res.status(401).json({
      message: "Unauthorized",
    })
  }


}

module.exports = { createMusic,createAlbum };
