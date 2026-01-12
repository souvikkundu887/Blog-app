const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    comment:{
       type:String,
       required:true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
             ref:"User"
        }
    ],
    //for nested comments
    replies:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ],
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment",
        default:null
    }
},{timestamps:true})

const comments=mongoose.model("comment",commentSchema)
module.exports=comments