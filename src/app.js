const express=require("express")
const cookieParer=require("cookie-parser")


const app=express()
app.use(express.json())
app.use(cookieParer())


module.exports=app