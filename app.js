
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected to DB:', mongoose.connection.name))
  .catch(err => console.error(err));

app.use(express.json());

const aboutRoute = require('./routes/aboutRoute');
app.use('/api/', aboutRoute);

const costRoutes = require('./routes/costRoutes');
app.use('/api/', costRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/', userRoutes);

app.get('/',(req,res)=>{
    res.send('API is Running');
});

const PORT = process.env.PORT || 3000;

module.exports = app;