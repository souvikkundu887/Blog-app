const { verifyJWT } = require("../utills/generateToken");

function verifyUser(req, res, next) {
   try{
     const token = req.headers.authorization.split(" ")[1]
        
     if (!token) {
        return res.status(401).json({ success: false, message: "unauthorized access in token" })
       }
    // now verify the token is valid or not
    let isValid = verifyJWT(token);
   //  console.log(isValid)
    if (!isValid) {
        return res.status(401).json({ success: false, message: "unauthorized access token expired" });
    }
   //  console.log(isValid.payload)
   //  req.body.creator = isValid.payload.id;
   req.user = { id: isValid.payload.id };
    next();
   }
   catch(error){
      console.log("hello")
    console.log(error)
   }
}
module.exports = verifyUser