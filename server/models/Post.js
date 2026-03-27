const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      zh: { type: String, required: true, trim: true },
    },
    content: {
      en: { type: String, required: true, default: '' },
      zh: { type: String, required: true, default: '' },
    },
    excerpt: {
      en: { type: String, default: '', trim: true },
      zh: { type: String, default: '', trim: true },
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true, // e.g. "my-first-post" — used in URLs
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: false, // drafts won't show on the public blog
    },
    coverImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // auto adds createdAt + updatedAt
  }
)

module.exports = mongoose.model('Post', PostSchema)