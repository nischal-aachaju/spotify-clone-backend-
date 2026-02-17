const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");
const albumModel = require("../models/album.model")
async function createMusic(req, res) {

  const decode = req.user
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

async function createAlbum(req, res) {
  const decode = req.user
  const { title, musics } = req.body

  const album = await albumModel.create({
    title,
    artist: decode.id,
    musics: musics
  })
  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics
    }
  })
}

async function getAllMusic(req,res) {

  const music=await musicModel
  .find()
  .skip(3)
  .limit(3)
  .populate("artist","username" )
  res.status(200).json({
    message:"all musics",
    music:music,

  })
}

async function getAlbum(req,res){
  const album= await albumModel.find().select("title artist ").populate("artist","username")
  res.status(200).json({
    message:"all album",
    album:album
  })

}

async function getAlbumById(req,res){
  const AlbumId =req.params.id
  const album =await albumModel.findById(AlbumId).populate("artist","username")
  res.status(200).json({
    music:album
  })
}

module.exports = { createMusic, createAlbum,getAllMusic,getAlbum,getAlbumById };
