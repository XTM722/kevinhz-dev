const express  = require('express')
const mongoose = require('mongoose')
const cors     = require('cors')
require('dotenv').config()

const app  = express()
const PORT = process.env.PORT || 5000

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────

app.use(cors({
  origin: '*', // tighten this in Phase 2 to your Vercel URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())

// ─── DATABASE ─────────────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is missing')
  process.exit(1)
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err))

// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.use('/api/auth',        require('./routes/auth'))
app.use('/api/posts',       require('./routes/posts'))
app.use('/api/friendlinks', require('./routes/friendlinks'))

// Health check — your frontend polls this to show Online/Offline
app.get('/api', (req, res) => {
  res.json({ status: 'Online', message: 'System Operational' })
})

// ─── START ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})