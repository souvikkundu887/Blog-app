const jwt = require('jsonwebtoken')
require('dotenv').config()
function generateJWT(payload) {
  try {
    let token = jwt.sign({ payload }, process.env.JWT_SECRET_KEY)
    return token;
  } catch (error) {
    console.log(error)
  }
}


function verifyJWT(token) {
  try {
    console.log("verifying token:", token)
    let isValid = jwt.verify(token, "jwtsecretkey")
    return isValid;
  }
  catch (error) {
    console.log(error)
    return false;
  }
}

function decodeJWT(token) {
  try {
    let isValid = jwt.verify(token, "jwtsecretkey")
    let decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.log("invalid token")
  }
}

module.exports = { verifyJWT, generateJWT, decodeJWT }