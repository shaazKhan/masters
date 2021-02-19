const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const Users = mongoose.model("Users")
const {jwtKey} = require("../config/keys")
module.exports = (req,res,next) => {
    // make header for client to send token to server

    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).send({err:"You must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    // jwt method to verify token by passing key
    jwt.verify(token,jwtKey,async (err,payload)=> {
        if(err){
            return res.status(401).send({err:"You must be logged in"})
        }
        const {userId} = payload
        const users = await Users.findById(userId)
        req.users = users
        next()
    }) 
}