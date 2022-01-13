const express = require('express');
const mongoose = require('mongoose');
const app = express();


// CONNECTING TO MONGO DB 
const dotenv = require('dotenv')
dotenv.config()
const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL , () => console.log('connected to Mongo DB'))

// middlewares 
app.use(express.json())


// IMPORTING ROUTES 
const UserRoutes = require('./routes/Users');


// ROUTING
app.use('/api/auth',UserRoutes);


app.get('/',(req,res)=>{
    res.json({"status":"200","message":"Hello World"});
})




const PORT = process.env.PORT 
app.listen(PORT,() => console.log('Server Running on Port '+PORT))