require('dotenv').config(); 
const mongoose = require('mongoose');



const MONGODB_URI = "mongodb+srv://syedakbarzada1:rRnWy9KtRDCH1bvt@cluster0.w9o24.mongodb.net/Project1"


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB:", err));

module.exports = mongoose;
