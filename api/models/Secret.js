const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SecretSchema = new Schema({
  urlHash: {
    type: String,
    required: true
  },
  secretHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  remainingViews: {
    type: Number,
    required: true
  }
});

module.exports = Secret = mongoose.model("secret", SecretSchema);
