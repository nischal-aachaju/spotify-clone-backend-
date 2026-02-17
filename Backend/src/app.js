const express = require("express");
const cookieParer = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");
const cors=require("cors")

const app = express();
app.use(express.json());
app.use(cookieParer());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Hello backend"
    })
})
app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

module.exports = app;
