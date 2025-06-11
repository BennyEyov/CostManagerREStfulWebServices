// Import the Express framework
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the Mongoose model for Cost items
const Cost = require('../models/Cost');
// Import the Mongoose model for User items
const User = require('../models/User');

// Adds a new cost item to the database, only if the user exists
router.post('/add', async (req, res) => {
    // Destructure fields from request body
    const { userid, description, category, sum, date } = req.body;

    // Validate required fields
    if (!userid || !description || !category || !sum || !date) {
        return res.status(400).json({ error: 'Missing required field' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ id: Number(userid) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create new Cost instance
        const newCost = new Cost({
            userid: Number(userid),
            description,
            category,
            sum: Number(sum),
            date: new Date(date)
        });

        // Save cost entry to database
        await newCost.save();

        // Send success response
        res.status(201).json({ message: 'Cost added successfully', cost: newCost });

    } catch (error) {
        // Handle unexpected server errors
        res.status(500).json({ error: error.message });
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