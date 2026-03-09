const express    = require('express')
const router     = express.Router()
const FriendLink = require('../models/FriendLink')
const protect    = require('../middleware/auth')

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

// GET /api/friendlinks
// Returns all active friend links
router.get('/', async (req, res) => {
  try {
    const links = await FriendLink.find({ active: true }).sort({ createdAt: -1 })
    res.json(links)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch friend links' })
  }
})

// ─── ADMIN ROUTES (will be protected by JWT middleware in Phase 2) ─────────────

router.post('/', protect, async (req, res) => {
  try {
    const link = new FriendLink(req.body)
    await link.save()
    res.status(201).json(link)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const link = await FriendLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!link) return res.status(404).json({ error: 'Friend link not found' })
    res.json(link)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const link = await FriendLink.findByIdAndDelete(req.params.id)
    if (!link) return res.status(404).json({ error: 'Friend link not found' })
    res.json({ message: 'Friend link deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete friend link' })
  }
})

module.exports = router