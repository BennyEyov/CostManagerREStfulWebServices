/**
 * @module costRoutes
 * @description Express router module for handling cost-related endpoints.
 */

// Import the Express framework
const express = require('express');
// Create a new router instance
const router = express.Router();
// Import the Mongoose model for Cost items
const Cost = require('../models/Cost');

/**
 * POST /add
 * @summary Adds a new cost item to the database.
 * @route POST /add
 * @param {string} req.body.description - Description of the cost.
 * @param {string} req.body.category - Cost category (e.g., food, health).
 * @param {string} req.body.userid - ID of the user.
 * @param {number} req.body.sum - Cost amount.
 * @param {string|Date} [req.body.date] - Optional date of the cost (defaults to current date).
 * @returns {Object} 200 - The saved cost item.
 * @returns {Object} 500 - Server error with error message.
 */
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

/**
 * GET /report
 * @summary Returns a monthly cost report grouped by category.
 * @route GET /report
 * @param {string} req.query.id - User ID.
 * @param {number} req.query.year - Year of the report (e.g., 2025).
 * @param {number} req.query.month - Month of the report (1–12).
 * @returns {Object} 200 - JSON report object with grouped costs.
 * @returns {Object} 400 - Missing required query parameters.
 * @returns {Object} 500 - Server error with error message.
 */
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