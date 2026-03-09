const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      zh: { type: String, required: true },
    },
    content: {
      en: { type: String, required: true },
      zh: { type: String, required: true },
    },
    excerpt: {
      en: { type: String },
      zh: { type: String },
    },
    slug: {
      type: String,
      required: true,
      unique: true, // e.g. "my-first-post" — used in URLs
    },
    tags: [String],
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