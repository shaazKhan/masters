const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy
const keys = require("../config/keys")
const mongoose = require("mongoose")
const Users = mongoose.model("Users")

passport.serializeUser((user,done) => {
    done(null,user.id)
})

passport.deserializeUser((id,done) => {
    Users.findById(id).then((users)=>{
        done(null,users)
    })
})

passport.use(
    new GoogleStrategy({
        clientID : keys.googleClientId,
        clientSecret : keys.clientSecret,
        callbackURL : "/auth/google/callback"
    },(accessToken, refreshToken, profile,cb)=>{
        Users.findOne({oauthId:profile.id})
        .then((existingUser)=>{
            if(existingUser){
                cb(null,existingUser)
            }else{
                new Users({
                    oauthId:profile.id,
                    UserName:profile._json.name,
                    EmailId:profile._json.email,
                    ProfilePhoto:profile._json.picture
                }).save()
                .then(users => {
                    cb(null,users)
                })
            }
        })
    })
)

passport.use(
    new LinkedInStrategy({
        clientID : keys.linkedinClientId,
        clientSecret: keys.linkedinClientSecret,
        callbackURL :"/auth/linkedin/callback",
        profileFields:['id', 'first-name', 'last-name', 'email-address', 'headline']
    },(accessToken, refreshToken,profile,cb)=>{
        Users.findOne({oauthId:profile.id})
        .then((existingUser)=>{
            if(existingUser){
                cb(null,existingUser)
            }else{
                new Users({
                    oauthId:profile.id,
                    UserName:profile.displayName,
                    ProfilePhoto:profile.photos[0].value
                }).save()
                .then(users => {
                    cb(null,users)
                })
            }
        })
    })
)