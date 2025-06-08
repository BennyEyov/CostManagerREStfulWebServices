/**
 * @module models/User
 * @description Mongoose model for representing a user.
 */

const mongoose = require('mongoose');


/**
 * Mongoose schema for a user.
 * @typedef {Object} User
 * @property {number} id - A unique numeric ID for the user (required).
 * @property {string} first_name - The user's first name (required).
 * @property {string} last_name - The user's last name (required).
 * @property {Date} birthday - The user's birth date (required).
 * @property {string} marital_status - Marital status, either 'single' or 'married' (required).
 */
const userSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    birthday: {type: Date, required: true},
    marital_status: {type: String, enum:['single','married'], required: true}
});

module.exports = mongoose.model('User', userSchema);