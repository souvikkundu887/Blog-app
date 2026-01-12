const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
        user: "kundusouvik2023@gmail.com",
        pass: "hsjakakakkal",
    }
})
module.exports=transporter
