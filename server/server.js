const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. DYNAMIC PORT (Crucial for Render)
// Render sets process.env.PORT. If it's missing, use 5000 (for local).
const PORT = process.env.PORT || 5000;

// 2. MIDDLEWARE (CORS)
// This allows your Vercel frontend to fetch data from this server
app.use(cors({
    origin: '*', // For now, allow all connections (easiest for setup)
    methods: ['GET', 'POST']
}));
app.use(express.json());

// 3. DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is missing");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected (Online)'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 4. THE API ROUTE (The Handshake)
// This is what your frontend checks to see if the system is "Online"
app.get('/api', (req, res) => {
  res.json({ status: 'Online', message: 'System Operational' });
});

// 5. START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});