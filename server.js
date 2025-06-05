// require('dotenv').config();
// const mongoose = require('mongoose');
// const app = require('./app');

// const PORT = process.env.PORT || 3000;

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected to DB:', mongoose.connection.name);
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => console.error(err));


const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});