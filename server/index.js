const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config");
const cors = require("cors")
const router = require("./routes/qart/index")
const passport = require("passport");
const { jwtStrategy } = require("./config/passport");
const app = express()
mongoose.connect(config.mongoose.url).then(() => {
    console.log("connect to mongodb")
})
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())
passport.use("jwt", jwtStrategy)
app.use("/verse", router)

app.get("/", (req, res) => {
    res.send("Hello welcome to Cart Project")
})
app.listen(config.port, () => {
    console.log("listening to port 8082")
})