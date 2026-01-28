const mongoose = require('mongoose');
require('dotenv').config(); // Load the .env file

// 1. Get the connection string from the secure file
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is missing in .env file");
  process.exit(1); // Stop the server if no database key
}

// 2. Connect to MongoDB Atlas (Cloud)
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected (Online)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));