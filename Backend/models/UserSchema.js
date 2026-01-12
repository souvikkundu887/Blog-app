const mongoose = require('mongoose');
const Blogs = require('./BlogSchema');
const { verify } = require('../utills/transporter');
const UserSChema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    blog: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blog'
        },
    ],

    verified:{
        type:Boolean,
        default:false
    }

})
const User = mongoose.model("User", UserSChema);
module.exports = User