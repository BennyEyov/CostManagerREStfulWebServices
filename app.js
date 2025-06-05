// const express = require('express');
// const app = express();
// const aboutRoute = require('./routes/aboutRoute');
// const costRoutes = require('./routes/costRoutes');
// const userRoutes = require('./routes/userRoutes');

// app.use(express.json());
// app.use('/api/about', aboutRoute);
// app.use('/api/', costRoutes);
// app.use('/api/users', userRoutes);

// app.get('/', (req, res) => {
//   res.send('API is Running');
// });

// module.exports = app;


require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

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
// app.listen(PORT, ()=>{
//     console.log(`Server running on port ${PORT}`);
// });

module.exports = app;