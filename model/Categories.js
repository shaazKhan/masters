const mongoose = require("mongoose")

const CategoriesSchema = new mongoose.Schema({
    categoryType : {
        type : String,
        required : true
    }

})

mongoose.model("Categories",CategoriesSchema)