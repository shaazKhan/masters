require("./model/Categories")
require("./model/StoryDescription")
require("./model/Users")
require("./services/passport")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const passport = require("passport")
const mongoose = require("mongoose")
const keys = require("./config/keys")
const cookieSessions = require("cookie-session")
//routes
const categoryRoute = require("./routes/categoryRoute")
//body parsing
app.use(cookieSessions({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys:[keys.cookieKey]
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/",(req,res)=>{
    res.send("welcome to node js")
})
app.use(bodyParser.json())
app.use(categoryRoute)

//mongo connection
const mongoUri = keys.mongoUri

mongoose.connect(mongoUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex : true
}) //first place uri

mongoose.connection.on("connected",()=>{
    console.log("mongo connected")
    
})



app.listen(process.env.PORT||3000,()=>{
    console.log("server run")
}) // port number followed by call back function


