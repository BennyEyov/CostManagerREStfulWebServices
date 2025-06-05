const express = require('express');
const router = express.Router();
const Cost = require('../models/Cost');

router.post('/add', async (req,res)=>{
    try{
        const {description, category, userid, sum, date} = req.body;

        const costItem = new Cost({
            description,
            category,
            userid,
            sum,
            date: date || new Date()
        });

        const savedCost = await costItem.save();

        res.json(savedCost);
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

router.get('/report', async (req,res)=>{
    const {id, year, month}= req.query;

    if(!id || !year || !month){
        return res.status(400).json({error: 'Missing required query parameters'});
    }

    const startDate = new Date(year,month -1, 1);
    const endDate = new Date(year, month, 0,23,59,59,999);

    try{
        const costs = await Cost.find({
            userid: id,
            date: {$gte: startDate, $lte: endDate}
        });

        const categories = ['food','health','housing','sport','education'];
        const groupedCosts = categories.map(category => ({[category]: []}));

        costs.forEach(cost=>{
            const day = cost.date.getDate();
            const categoryIndex = categories.indexOf(cost.category);
            if(categoryIndex !== -1){
                groupedCosts[categoryIndex][cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day: day
                });
            }
        });

        res.json({
            userid: id,
            year: Number(year),
            month: Number(month),
            costs: groupedCosts
        });
    } catch(error){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;