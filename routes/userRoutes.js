const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Cost = require('../models/Cost');

router.get('/users/:id', async (req,res)=>{
    const {id} = req.params;

    try{
        const user = await User.findOne({id: Number(id)});
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        const costs = await Cost.find({user_id:Number(id)});
        const total = costs.reduce((sum,item) => sum+item.sum, 0);

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

router.post('/users', async (req,res)=>{
    try{
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch(error){
        if(error.code === 11000){
            return res.status(400).json({error: 'User ID already exists'});
        }
        res.status(400).json({error: error.message});
    }
});

router.post('/users', async (req,res) =>{
    const {userid, description, category, sum, date} = req.body;

    if(!user_id||!description||!category||!sum||!date){
        return res.status(400).json({error: 'Missing required field'});
    }

    try{
        const user = await User.findOne({id: Number(userid)});
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        const newCost = new Cost({
            userid: Number(userid),
            description,
            category,
            sum: Number(sum),
            date: new Date(date)
        });

        await newCost.save();

        res.status(201).json({message:'Cost added successfully', cost: newCost});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;