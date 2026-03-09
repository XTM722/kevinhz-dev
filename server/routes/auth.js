const express = require('express')
const router  = express.Router()
const jwt     = require('jsonwebtoken')
const User    = require('../models/User')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
// One-time use to create your admin account.
// After creating your account, you should disable or delete this route.
router.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const exists = await User.findOne({ username })
    if (exists) return res.status(400).json({ error: 'User already exists' })

    const user = new User({ username, password })
    await user.save()
    res.status(201).json({ token: generateToken(user._id) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
// Send { username, password } → get back a JWT token
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const match = await user.matchPassword(password)
    if (!match) return res.status(401).json({ error: 'Invalid credentials' })

    res.json({ token: generateToken(user._id) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router