const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types

const StoriesSchema = new mongoose.Schema({
    storyCategory : {
        type : String,
        required : true
    },
    storyImage:{
        type:String,
        required:true
    },
    storyDescription:{
        type:String,
        required:true
    },
    storyTitle:{
        type : String,
        required : true
    },
    likes: 
        [{
            type:String,
        }]
    ,
    comments:[{
        Comments : {
            type : String
        },
        PostedBy : {
            type : String,
            
        }
    }],
    tags:{
        type:String,
        required : true
    },
    storyStatus:{
        type:String,
        required:true,
        default : "Pending"
    },
    postedBy:{
        type : ObjectId,
        ref : "Users"
    },
    createdAt:{
        type : String,
        required : true
    },
    emailId:{
        type : String,
        required : true
    }


})

mongoose.model("Stories",StoriesSchema)