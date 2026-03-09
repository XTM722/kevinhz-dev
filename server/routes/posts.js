const express  = require('express')
const router   = express.Router()
const Post     = require('../models/Post')
const protect  = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .select('-content')
      .sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// ⚠️ /admin/all 必须在 /:slug 前面
router.get('/admin/all', protect, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const post = await Post.create(req.body)
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json({ message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

// ⚠️ /:slug 必须放最后
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

module.exports = router