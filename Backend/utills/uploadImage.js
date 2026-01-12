const cloudinary = require('cloudinary').v2;

async function uploadImage(filePath) {
    try {
        // console.log(filePath)
        const res = await cloudinary.uploader.upload(filePath, {
            folder: "blogimage",
        })
        // console.log("cloudinary upload response", res)
        return res;
    } catch (err) {
        console.log(err)
    }
}
async function deleteImage(public_id){
 
        const res =await cloudinary.uploader.destroy(public_id,function (error,result){
            if(error){
                console.log("cloudinary delete errror",error);
            }
            else{
                console.log("cloudinary delete resukt",result)
            }
        })
    
  
}
module.exports = {uploadImage, deleteImage}