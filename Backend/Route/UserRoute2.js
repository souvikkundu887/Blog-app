const express=require('express');
const route=express.Router();
const Users = require('../models/UserSchema');

route.get("/users",(req,res)=>{
    try{
        res.status(200).json({message:"updated version of api v1"})
    }
    catch(err){
       res.status(500).json({message:"internal server error"})
    }
})

module.exports=route