const mongoose = require('mongoose')
require('dotenv').config()
// console.log(process.env.DB_URL)
async function dbconnect(URL) {
    try {
        console.log(URL)
        await mongoose.connect("mongodb://localhost:27017/blogusers")
        console.log("db connected")
    }
    catch (err) {
         console.log("error")
    }
}
module.exports=dbconnect;