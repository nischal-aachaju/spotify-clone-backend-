const mongoose= require("mongoose")

const albumSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    musics:[{
        type: mongoose.Schema.ObjectId,
        ref:"music"
    }],
    artist:{
        type:String,
        ref:"user",
        required:true
    }
})

const albumModel=mongoose.model("album",albumSchema)

module.exports=albumModel