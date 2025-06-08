/**
 * @file app.js
 * @description Entry point of the Express application. Sets up middleware, connects to MongoDB, and mounts API routes.
 * @requires express
 * @requires mongoose
 * @requires dotenv/config
 */

require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Log the MongoDB URI for debugging
console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to DB:', mongoose.connection.name))
  .catch(err => console.error(err));

// Middleware to parse incoming JSON requests
app.use(express.json());

/**
 * Mounts the /api/about route.
 * @module routes/aboutRoute
 */
const aboutRoute = require('./routes/aboutRoute');
app.use('/api/', aboutRoute);

/**
 * Mounts the /api/add and /api/report routes.
 * @module routes/costRoutes
 */
const costRoutes = require('./routes/costRoutes');
app.use('/api/', costRoutes);

/**
 * Mounts the /api/users routes.
 * @module routes/userRoutes
 */
const userRoutes = require('./routes/userRoutes');
app.use('/api/', userRoutes);


/**
 * Root route that confirms the API is running.
 * @name GET /
 * @function
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
app.get('/',(req,res)=>{
    res.send('API is Running');
});


const PORT = process.env.PORT || 3000;

module.exports = app;