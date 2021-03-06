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
    default: undefined
  },
  remainingViews: {
    type: Number,
    required: true
  }
});

SecretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("secret", SecretSchema);
