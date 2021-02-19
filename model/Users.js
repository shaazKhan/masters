const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const UsersSchema = new mongoose.Schema({
    oauthId : {
        type : String
    },
    UserName : {
        type : String,
        required : true
    },
    EmailId:{
        type:String,
        //required:true,
        unique : true
    },
    Password:{
        type:String,
        //required:true
    },
    ProfilePhoto:{
        type:String,
        //required:true,
        
    },
    MobileNumber:{
        type:Number,
        //required:true,
        //unique:true,
    }

})

UsersSchema.pre("save",function(next){
    const user = this
    if(! user.isModified("Password")){
        return next()
    } // user haven't change his password
    bcrypt.genSalt(15,(err, salt)=>{
        if(err){
            return next(err)
        }
        bcrypt.hash(user.Password,salt,(err, hash)=>{
            if(err){
                return next(err)
            }
            user.Password = hash
            next()
        })
    })
})

UsersSchema.methods.comparePassword = function (candidatePassword){
    const user = this;
    return new Promise((resolve, reject) =>{
        bcrypt.compare(candidatePassword,user.Password,(err,isMatch) =>{
            if(err){
                return reject(err)
            }
            if(!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model("Users",UsersSchema)