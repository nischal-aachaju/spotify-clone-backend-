const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const { uploadFile } = require("../services/storage.service");

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

module.exports = { createMusic };
