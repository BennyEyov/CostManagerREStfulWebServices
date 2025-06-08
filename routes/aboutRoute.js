// Import the Express framework
const express = require('express');
// Create a new router object to handle routes related to "about"
const router = express.Router();
// Import the controller function that will handle the logic for the route
const {getTeamInfo} = require('../controllers/aboutController');
// Define a GET route for "/about" that uses the getTeamInfo controller function
router.get('/about', getTeamInfo);

module.exports = router;