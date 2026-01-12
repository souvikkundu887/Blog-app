const User = require("../models/UserSchema");
const bcrypt = require("bcrypt")
const { generateJWT, decodeJWT, verifyJWT } = require("../utills/generateToken");
const transporter = require("../utills/transporter");

// async function sendVerfificationEmail(){
//  let verificationToken=await generateJWT({
//     email:
//  })
// }
async function UserCreate(req, res) {
    try {
        const { name, email, password } = req.body
        if (!name || !password || !email) {
            res.status(400).send("All fields are required");
            return;
        }
        //check password length and mix combinations of letter,numeric,and special character
        const checkexistinguser = await User.findOne({ email })

        if (checkexistinguser) {
            // console.log("user already exists")
            if (checkexistinguser.verified) {
                return res.status(400).json({
                    success: false,
                    message: "users already exists with this email."
                })
            }
            else {
                // sendVerfificationEmail
                let VerificationToken = generateJWT({
                    email: checkexistinguser.email,
                    id: checkexistinguser._id
                })


                await transporter.sendMail({
                    from: "Blogapp",
                    to: "kundusouvik2023@gmail.com",
                    subject: "Email verification",
                    text: "hello ji",
                    html: `<h1 >Please click on the link to<a href="http://localhost:5173/verify-email/${VerificationToken}"> verify </a>your email</h1>`
                })

            }
        }

        const hashpassword = await bcrypt.hash(password, 10)



        let newuser = await User.create({
            name,
            email,
            password: hashpassword
        })

        let VerificationToken = generateJWT({
            email: email,
            id: newuser._id
        })


        await transporter.sendMail({
            from: "Blogapp",
            to: "kundusouvik2023@gmail.com",
            subject: "Email verification",
            text: "hello ji",
            html: `<h1 >Please click on the link to<a href="http://localhost:5173/verify-email/${VerificationToken}"> verify </a>your email</h1>`
        })


        res.status(201).json({
            success: true,
            message: "please check your Email to verify"

        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error", error: error });
    }
}

async function getUsers(req, res) {
    try {
        const { token } = req.body;
        const newUser = await User.find({}, { password: 0 })
        const decode = decodeJWT(token)
        console.log(decode)
        return res.status(200).json({
            success: true,
            message: "users get successfully",
            user: decode
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" + error });
    }
}
async function getUserById(req, res) {
    try {

        const id = req.params.id;

        // let user = users.find(item => item.id == req.params.id)
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "user was not found" })
        }
        res.status(200).json({
            success: true,
            message: "user was found",
            user
        })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Internal Server Error", err });

    }
}
async function UpdateUser(req, res) {
    try {
        const { name, email, password } = req.body
        const { id } = req.params;
        const updateduser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true })


        return res.status(200).json({
            success: "true",
            message: "users data updated succesfully",
            updateduser
        })
    }
    catch (err) {
        return res.status(500).json({ message: "internal server error", err })
    }
}

async function deleteuser(req, res) {
    const { id } = req.params
    const deleteuser = await Users.findByIdAndDelete(id);
    console.log(deleteuser)
    return res.status(200).json({
        success: true,
        message: "user was removed",
        deleteuser
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body
    try {


        const checkexistinguser = await User.findOne({ email })

        if (!checkexistinguser) {
            console.log("user not found")
            return res.status(400).json({
                success: false,
                message: "email"
            })
        }

        if (!checkexistinguser.verified) {
            //send verification email
            let VerificationToken = generateJWT({
                email: checkexistinguser.email,
                id: checkexistinguser._id
            })


            await transporter.sendMail({
                from: "Blogapp",
                to: "kundusouvik2023@gmail.com",
                subject: "Email verification",
                text: "hello ji",
                html: `<h1 >Please click on the link to<a href="http://localhost:5173/verify-email/${VerificationToken}"> verify </a>your email</h1>`
            })


            return res.status(400).json({
                success: false,
                message: "please verify your email before login"
            })
        }

        let matchpassword = await bcrypt.compare(password, checkexistinguser.password)



        if (!matchpassword) {
            return res.status(400).json({
                success: false,
                message: "password"
            })
        }
        let token = generateJWT({
            email: checkexistinguser.email,
            id: checkexistinguser._id
        })

        res.status(201).json({
            success: true, message: "user loggedin successfully", user: {
                id: checkexistinguser._id,
                name: checkexistinguser.name,
                email: checkexistinguser.email,
                token
            }
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error", error: "email is already registered" });
    }
}

async function verifyUser(req, res) {
    try {
        const { verificationToken } = req.params;
        const verifyToken = await verifyJWT(verificationToken)
        console.log(verifyToken)

        if (!verifyToken) {
            return res.status(400).json({
                succes: false,
                message: "invalid token"
            })
        }

        const id = verifyToken.payload.id;

        const user = await User.findByIdAndUpdate(id, { verified: true }, { new: true })
        return res.status(200).json({
            success: true,
            message: "user verified successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}




module.exports = { UserCreate, getUsers, getUserById, UpdateUser, deleteuser, loginUser, verifyUser };