const app = require('./app'); // Import app setup
const db = require('./config/db'); // Database configuration
const PORT = process.env.PORT || 5000; // Use environment variable for the port or default to 5000

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
