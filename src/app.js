const express=require("express")
const cookieParer=require("cookie-parser")
const authRoutes=require("./routes/auth.routes")


const app=express()
app.use(express.json())
app.use(cookieParer())
app.use("/api/auth",authRoutes)




module.exports=app