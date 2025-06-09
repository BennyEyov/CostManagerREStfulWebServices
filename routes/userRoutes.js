/**
 * @module userRoutes
 * @description Express router module for user-related operations.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Mongoose model for users
const Cost = require('../models/Cost'); // Mongoose model for cost entries

/**
 * GET /users/:id
 * @summary Retrieves a user's information along with the total of all their costs.
 * @route GET /users/{id}
 * @param {number} req.params.id - The user's unique numeric ID.
 * @returns {Object} 200 - User data including total costs.
 * @returns {Object} 404 - User not found.
 * @returns {Object} 500 - Server error with error message.
 */
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


/**
 * POST /users
 * @summary Creates a new user.
 * @route POST /users
 * @param {Object} req.body - The user data.
 * @param {number} req.body.id - Unique numeric ID of the user.
 * @param {string} req.body.first_name - First name of the user.
 * @param {string} req.body.last_name - Last name of the user.
 * @returns {Object} 201 - Created user object.
 * @returns {Object} 400 - Validation error or duplicate ID.
 */
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

module.exports = router;
