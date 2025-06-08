// Import the Express framework
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the Mongoose model for Cost items
const Cost = require('../models/Cost');

// Adds a new cost item to the database
router.post('/add', async (req,res)=>{
    try{
        // Destructure fields from the request body
        const {description, category, userid, sum, date} = req.body;
        // Create a new Cost instance with the provided data (use current date if not given)
        const costItem = new Cost({
            description,
            category,
            userid,
            sum,
            date: date || new Date()
        });
        // Save the cost item to MongoDB
        const savedCost = await costItem.save();
        // Respond with the saved item
        res.json(savedCost);
    } catch(error){
        // Handle server error        
        res.status(500).json({error: error.message});
    }
});

// Returns a monthly cost report grouped by category
router.get('/report', async (req,res)=>{
    // Destructure query parameters
    const {id, year, month}= req.query;
    // Validate required query parameters
    if(!id || !year || !month){
        return res.status(400).json({error: 'Missing required query parameters'});
    }
    // Create start and end date for the given month
    const startDate = new Date(year,month -1, 1);
    const endDate = new Date(year, month, 0,23,59,59,999);

    try{
        // Query the database for cost items matching the user and date range        
        const costs = await Cost.find({
            userid: id,
            date: {$gte: startDate, $lte: endDate}
        });

        const categories = ['food','health','housing','sport','education'];
        // Initialize grouped costs as an array of objects with category names as keys
        const groupedCosts = categories.map(category => ({[category]: []}));
        // Group the cost items into their respective categories
        costs.forEach(cost=>{
            const day = cost.date.getDate();
            const categoryIndex = categories.indexOf(cost.category);
            // If the category is valid, push the cost item into the appropriate group            
            if(categoryIndex !== -1){
                groupedCosts[categoryIndex][cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day: day
                });
            }
        });
        // Return the grouped cost report
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