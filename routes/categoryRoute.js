const express = require("express")
const mongoose = require("mongoose")
const Categories = mongoose.model("Categories")
const jwt = require("jsonwebtoken")
const {jwtKey} = require("../config/keys")
const requireUserToken = require("../middleware/requireUserToken")
const Stories = mongoose.model("Stories")
const Users = mongoose.model("Users")
const passport = require("passport")
const router = express.Router()

// google oauth
router.get('/auth/google',passport.authenticate("google",{
    scope:["profile",'email']
}))

// linked in oauth
router.get('/auth/linkedin',passport.authenticate("linkedin",{
    scope:['r_liteprofile','r_emailaddress']
}))

//google call back
router.get("/auth/google/callback",passport.authenticate("google"))
//linked in call back

router.get("/auth/linkedin/callback",passport.authenticate("linkedin"))

// o auth current_user
router.get('/current_user',(req, res)=>{
    res.send(req.user)
})

// o auth logout
router.get('/api/logout',(req, res)=>{
    req.logOut()
    res.send(req.user)
})

// post a new category
router.post("/categories",(req,res)=>{
    const categories = new Categories({
        categoryType : req.body.categoryType
    })
    
    categories
        .save()
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.json(err)
        })
})
// get all the categories
router.get("/categories",(req,res)=>{

    Categories
        .find()
        .then(data=>{
            res.json(data)
        })
        .catch(err=>{
            res.json(err)
        })
})




// post a story 
router.post("/StoryPosting",requireUserToken,(req,res)=>{
    const {storyCategory,storyImage,storyDescription,tags,postedBy,storyTitle,createdAt,emailId} = req.body
    const stories = new Stories({
        storyCategory,
        storyImage,
        storyDescription,
        storyTitle,
        tags,
        postedBy,
        createdAt,
        emailId
    })
    stories.save()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.json(err)
    })
})

// get particular story based on user Id i.e display a story to the user who posted it
router.get("/StoryInformation",(req,res)=>{
    const postedBy = req.query.postedBy
    Stories.find({postedBy})
    .then(data=>res.json(data))
    .catch(err=>res.send(err))
})

// get story information based on tags such as masters  blasters and so on
router.get("/StoryCategory",async(req,res)=>{
    const storyCategory = req.query.storyCategory
    try {
        
        const posts = await Stories.find({storyCategory})
        res.json(posts)
    }
    catch (err) {
        res.json(err)
    }
    

})

// get a story based on Id
router.get("/story/:storyId",async (req, res) => {
    
    const _id = req.params.storyId
    
    try {
        const posts = await Stories.find({_id})
        res.send(posts)
    } catch (error) {
        res.send(err)
    }
})


// show all story 
router.get("/StoryPosting",(req,res)=>{
    Stories.find()
    .then(data=>{
        res.json(data)
        
    })
    .catch(err=>{
        res.json(err)
    })
})

// signup by providing the following detais
router.post("/signup",(req,res)=>{
    const {UserName,EmailId,Password,ProfilePhoto,MobileNumber} = req.body
    const users = new Users({
        UserName,EmailId,Password,ProfilePhoto,MobileNumber
    })
    const token = jwt.sign({userId:users._id},jwtKey)
    users.save()
    .then(data=>res.json({
        data,
        token
    }))
    .catch(err=>res.json(err))

})

// login via email and password
router.post("/login",async (req, res) => {
    const {EmailId,Password} = req.body
    if(!EmailId || !Password){
        return res.status(422).json({error: "Must provide email or password"})
    }
    const users = await Users.findOne({EmailId})
    if(!users){
        return res.status(422).json({error: "Must provide email or password"})
    }
    try {
        await users.comparePassword(Password)
        const token = jwt.sign({userId:users._id},jwtKey)
        res.send({token,users})
    } catch (error) {
        return res.status(422).json({error: "Must provide email or password"})
    }
    
})
// get all the details of the users
router.get("/login",async (req, res)=> {
    const Data = await Users.find()
    try {
        res.send(Data)
    } catch (error) {
        res.send(err)
    }
})

// get user details based on _id
router.get("/login/:loginId",async (req, res) => {
    const _id = req.params.loginId
    const data = await Users.findById(_id)
    try {
        res.send({
            _id: data._id,
            Name: data.UserName,
            EmailId : data.EmailId,
            ProfilePhoto : data.ProfilePhoto,
            MobileNumber : data.MobileNumber
        })
    } catch (error) {
        res.send(error)
    }
})

// comments , enter the comments and postedby: Name , which will be the name of the user who posted a comment
router.patch("/story/:storyId",(req,res)=>{
    const _id = req.params.storyId 
    const {Comments,PostedBy} = req.body
    Stories.updateOne({_id},{
        $push:{
            comments : [{
                Comments,
                PostedBy
            }]
        }
    }).then(data=>res.json({data,message:"sucess"}))
    .catch(err=>res.send(err))
})

// likes
// mb.bom/story/likes/52525525
router.patch("/Likes/:storyId",(req,res)=>{
    const _id = req.params.storyId
    const {LikedBy} = req.body
    Stories.updateOne({_id},{
        $push:{
           likes : [
               LikedBy // user id //async storage 
            ] 
        }
    }).then(data=>res.json(data))
    .catch(err=>res.json(err))
})

router.patch("/unlikes/:storyId",(req,res)=>{
    const _id = req.params.storyId
    const {LikedBy} = req.body
    Stories.updateOne({_id},{
        $pullAll:{
            likes :  [
                   LikedBy
                ]
            }
        })
    .then(data=>res.json({data,message:"success"}))
    .catch(err=>res.json(err))
})




module.exports = router