const mongoose = require('mongoose')

const FriendLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },  // e.g. "KevinZ"
    url:  { type: String, required: true },  // e.g. "https://kevinhz.dev"
    description: {
      en: { type: String, default: '' },
      zh: { type: String, default: '' },
    },
    avatar: { type: String, default: '' },   // profile image URL
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('FriendLink', FriendLinkSchema)