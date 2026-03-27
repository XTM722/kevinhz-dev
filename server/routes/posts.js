const express  = require('express')
const router   = express.Router()
const sanitizeHtml = require('sanitize-html')
const Post     = require('../models/Post')
const protect  = require('../middleware/auth')

function toText(value) {
  if (typeof value !== 'string') return ''
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    allowedSchemes: ['http', 'https', 'mailto'],
  }).trim()
}

function normalizeCoverImage(url = '') {
  const clean = toText(url)
  if (!clean) return ''
  return /^https?:\/\/\S+$/i.test(clean) ? clean : ''
}

function normalizeBilingual(field = {}) {
  if (typeof field === 'string') {
    const text = toText(field)
    return { en: text, zh: text }
  }

  const en = toText(field.en)
  const zh = toText(field.zh)
  return {
    en: en || zh,
    zh: zh || en,
  }
}

function normalizeSlug(slug = '') {
  return toText(slug)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeTags(tags) {
  const list = Array.isArray(tags)
    ? tags
    : typeof tags === 'string'
      ? tags.split(',')
      : []

  return [...new Set(
    list
      .map(tag => toText(tag).toLowerCase())
      .filter(Boolean)
  )]
}

function normalizePostPayload(body = {}) {
  const title = normalizeBilingual(body.title)
  const content = normalizeBilingual(body.content)
  const excerpt = normalizeBilingual(body.excerpt)
  const slug = normalizeSlug(body.slug)

  if (!title.en || !title.zh) {
    throw new Error('Title is required in both EN and ZH')
  }
  if (!content.en || !content.zh) {
    throw new Error('Content is required in both EN and ZH')
  }
  if (!slug) {
    throw new Error('Slug is required')
  }

  return {
    title,
    content,
    excerpt,
    slug,
    tags: normalizeTags(body.tags),
    published: Boolean(body.published),
    coverImage: normalizeCoverImage(body.coverImage),
  }
}

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
    const payload = normalizePostPayload(req.body)
    const post = await Post.create(payload)
    res.status(201).json(post)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const payload = normalizePostPayload(req.body)
    const post = await Post.findByIdAndUpdate(req.params.id, payload, {
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
    const slug = normalizeSlug(req.params.slug)
    if (!slug) return res.status(404).json({ error: 'Post not found' })
    const post = await Post.findOne({ slug, published: true })
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

module.exports = router