const cloudinary = require('cloudinary').v2;
require('dotenv').config();
async function cloudinaryConfig() {
   try{
     cloudinary.config(
        {
            cloud_name:process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        }
     
    )

    console.log("cloudinary")
   }catch(err){
    console.log("cloudinary err",err);
   }
}

module.exports=cloudinaryConfig;