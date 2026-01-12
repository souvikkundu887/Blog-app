const express = require('express');
const route = express.Router();
const Users = require('../models/UserSchema');
const { UserCreate, getUsers, getUserById, UpdateUser, deleteuser, loginUser, verifyUser } = require('../controllers/UserController');

route.get("/users", getUsers)
route.post("/signin", loginUser)

route.post("/signup", UserCreate)

route.get("/users", getUsers)


route.get("/users/:id", getUserById)


route.put("/users/:id", UpdateUser)

route.get("/verify-email/:verificationToken", verifyUser)

route.delete("/users/:id", deleteuser)
module.exports = route