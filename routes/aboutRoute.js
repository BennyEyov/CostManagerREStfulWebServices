/**
 * @module aboutRoutes
 * @description Express router module for the "About" page.
 */

// Import the Express framework
const express = require('express');
// Create a new router object to handle routes related to "about"
const router = express.Router();
// Import the controller function that will handle the logic for the route
const {getTeamInfo} = require('../controllers/aboutController');

/**
 * GET /about
 * @summary Retrieves information about the development team, uses the getTeamInfo controller function.
 * @route GET /about
 * @returns {Object} 200 - JSON object containing team information.
 * @returns {Object} 500 - Server error with error message.
 */
router.get('/about', getTeamInfo);

module.exports = router;