const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Mongoose model for users
const Cost = require('../models/Cost'); // Mongoose model for cost entries

// Get a user's info along with the total of all their costs
router.get('/users/:id', async (req,res)=>{
    const {id} = req.params;

    try{
        // Find the user by their numeric ID        
        const user = await User.findOne({id: Number(id)});
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        // Find and calculate all cost items associated with this user
        const costs = await Cost.find({userid:Number(id)});
        const total = costs.reduce((sum,item) => sum+item.sum, 0);
        // Respond with user info and total cost
        res.json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            total
        });
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

// Create a new user
router.post('/users', async (req,res)=>{
    try{
        // Attempt to create a user with the provided request body        
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch(error){
        // Handle duplicate key error (user ID already exists)        
        if(error.code === 11000){
            return res.status(400).json({error: 'User ID already exists'});
        }
        // Handle other validation or database errors        
        res.status(400).json({error: error.message});
    }
});

// router.post('/users', async (req,res) =>{
//     const {userid, description, category, sum, date} = req.body;

//     // Validate required fields    
//     if(!userid||!description||!category||!sum||!date){
//         return res.status(400).json({error: 'Missing required field'});
//     }

//     try{
//         // Verify that the user exists        
//         const user = await User.findOne({id: Number(userid)});
//         if(!user){
//             return res.status(404).json({error: 'User not found'});
//         }
//         // Create and save the new cost entry
//         const newCost = new Cost({
//             userid: Number(userid),
//             description,
//             category,
//             sum: Number(sum),
//             date: new Date(date)
//         });

//         await newCost.save();

//         res.status(201).json({message:'Cost added successfully', cost: newCost});
//     }catch(error){
//         res.status(500).json({error: error.message});
//     }
// });

module.exports = router;