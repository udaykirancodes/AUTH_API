const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET
const fetchUser = require('../middleware/fetchUser');

// importing model 
const Users = require('../models/users');

router.get('/',(req,res)=>{
    res.send('welcome');
})

// ROUTE 01 || REGISTER 
router.post('/register',async(req,res)=>{
    
    // validation
    if(req.body.username.length<3){
        return res.status(400).json('Username Too Short');
    }
    if(req.body.password.length<3){
        return res.status(400).json('Password Too Short');
    }
    
    // check if already exists 
    let user = await Users.findOne({username:req.body.username});
    if(user){
        return res.status(200).json('user already exists');
    }
    // password hashing 
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password,salt);

    // save the data into database
    try {
        user = new Users({
            username:req.body.username,
            name:req.body.name,
            password:hashedPassword
        })
        const newUser = await user.save();

        // SENDING JSON WEB TOKEN TO USER 
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        console.log(authToken);
        res.status(200).json({authToken:authToken});

    } catch (error) {
        res.status(500).send('Error Occured');
    }
    
})
router.post('/login',async(req,res)=>{
    // validation
    if(req.body.username.length<3){
        return res.status(400).json('Username Too Short');
    }
    if(req.body.password.length<3){
        return res.status(400).json('Password Too Short');
    }
    // check if user  exists 
    try {
        let user = await Users.findOne({username:req.body.username});
        if(!user){
            return res.status(400).json({error:"No user exists"});
        }

        let passwordCompare = await bcrypt.compare(req.body.password,user.password);
        if(!passwordCompare){
            res.status(400).json({error:"Password Error"});
        }

        // JWT AUTH 
        const data = {
            user:{
                id:user.id 
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);

        res.status(200).json({authToken});
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
    
})

// ROUTE 3 
router.get('/getuser',fetchUser,async(req,res)=>{
    try {
        let userId = req.user.id;
        const user = await Users.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router 