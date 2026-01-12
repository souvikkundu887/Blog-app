const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dbconnect = require('./config/dbconnect');
const Users=require("./models/UserSchema")
const UserRoute=require("./Route/UserRoute")
const UserRoute2=require("./Route/UserRoute2")
const BlogRoute=require("./Route/BlogRoute")
const cloudinaryConfig=require("./config/cloudinary")
const dotenv=require('dotenv')
dotenv.config();
const PORT=process.env.PORT
app.use(express.json());
app.use(cors())
console.log(PORT)
app.use("/api/v1",UserRoute)

app.use("/api/v2",UserRoute2)

app.use("/api/v1",BlogRoute)



// async function connectdb() {
//     try {
//         await mongoose.connect("mongodb://localhost:27017/blogusers")
//         console.log("db connected");
//     }
//     catch (err) {
//         console.log(err);
//     }
// }
// lWgr2Q6qwJZKtPqH


// const userSchema = new mongoose.Schema({
//     name: String,
//     email: {
//         type: String,
//         unique: true
//     },
//     password: String
// })
// const Users = mongoose.model("User", userSchema);


// app.get("/", (req, res) => {
//     res.send("Hello world")
// })
// app.post("/users", async (req, res) => {
//     const { name, email, password } = req.body
//     console.log(req.body)
//     try {

//         if (!name || !password || !email) {
//             res.status(400).send("All fields are required");
//             return;
//         }
//         // const user = { ...req.body, id: users.length + 1 }
//         // users.push(user);
//         const checkexistinguser = await Users.findOne({ email })
//         if (checkexistinguser) {
//             console.log("user already exists")
//             return res.status(400).json({
//                 success: false,
//                 message: "users already exists with this email"
//             })
//         }
//         const newUser = await Users.create({
//             name,
//             email,
//             password
//         })
//         res.status(201).json({ success: true, message: "user created successfully", newUser });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Internal Server Error", error: "email is already registered" });
//     }
// })

// app.get("/users", async (req, res) => {
//     try {
//         const user = await Users.find({})
//         console.log(user)
//         return res.status(200).json({ success: true, message: "users get successfully", user });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// })
// app.get("/users/:id", async (req, res) => {
//     try {

//         const id = req.params.id;

//         // let user = users.find(item => item.id == req.params.id)
//         const user = await Users.findById(id);
//         console.log(user)
//         console.log(user.id);
//         console.log(user._id)

//         if (!user) {
//             return res.status(404).json({ success: false, message: "user was not found" })
//         }
//         res.status(200).json({
//             success: true,
//             message: "user was found",
//             user
//         })
//     }
//     catch (err) {
//         return res.status(500).json({ success: false, message: "Internal Server Error", err });

//     }
// })


// app.put("/users/:id", async (req, res) => {
//     try {
//         const { name, email, password } = req.body
//         const { id } = req.params;
//         //check that user is present or not
//         // let updateindx = users.findIndex(item => item.id == id)
//         const updateduser = await Users.findByIdAndUpdate(id, { name, email, password }, { new: true })
//         console.log(updateduser)
//         // if (updateindx == -1) {
//         //     return res.status.json({ success: false, message: "user is not present" })
//         // }
//         // if (name && !email && !password) {
//         //     users[updateindx].name = name;

//         // }
//         // else if (!name && email && !password) {
//         //     users[updateindx].email = email;

//         // }
//         // else if (!name && !email && password) {
//         //     users[updateindx].password = password;

//         // }
//         // else {
//         //     users[updateindx] = { ...users[updateindx], ...req.body }
//         // }

//         return res.status(200).json({
//             success: "true",
//             message: "users data updated succesfully",
//             updateduser
//         })
//     }
//     catch (err) {
//         return res.status(500).json({ message: "internal server error", err })
//     }
// })

// app.delete("/users/:id", async (req, res) => {
//     const { id } = req.params
//     // let deleteuser = users.findIndex(item => item.id == id);
//     const deleteuser = await Users.findByIdAndDelete(id);
//     console.log(deleteuser)

//     // if (deleteuser == -1)
//     //     return res.status.json({ success: false, message: "user is not present" })
//     // users.splice(deleteuser, 1);
//     return res.status(200).json({
//         success: true,
//         message: "user was removed",
//         deleteuser
//     })

// })

// app.use("/",UserRoute)//connecting with userRoute

app.listen(3000, () => {
    console.log("server started on port 3000")
    dbconnect(process.env.DB_URL)
    cloudinaryConfig()
})