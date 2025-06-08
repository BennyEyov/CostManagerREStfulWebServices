/**
 * @file server.js
 * @description Starts the Express server on the specified port.
 * @requires ./app
 */

const app = require('./app');
const PORT = process.env.PORT || 3000;

/**
 * Starts the server and listens for incoming HTTP requests.
 * Logs the port number on successful startup.
 */
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});