const jwt = require("jsonwebtoken")

async function authArtist(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ message: "unauthorized" })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (decode.role !== "artist") {
           return res.status(403).json({ message: "you dont have access"})
        }
        req.user=decode
        next()
    }

    catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "unauthorized"
        })
    }
}

module.exports={authArtist}