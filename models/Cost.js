/**
 * @module models/Cost
 * @description Mongoose model for representing a cost entry.
 */

const mongoose = require('mongoose');

/**
 * Mongoose schema for a cost entry.
 * @typedef {Object} Cost
 * @property {string} description - A brief description of the cost (required).
 * @property {string} category - The category of the cost (food, health, housing, sport, education) (required).
 * @property {number} userid - The numeric ID of the user who made the expense (required).
 * @property {number} sum - The amount of the expense (required).
 * @property {Date} [date] - The date of the expense (defaults to now).
 */
const costSchema = new mongoose.Schema({
    description: {type: String, required: true},
    category: {type: String, enum:['food','health','housing','sport','education'], required: true},
    userid: {type: Number, required: true},
    sum: {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Cost', costSchema);