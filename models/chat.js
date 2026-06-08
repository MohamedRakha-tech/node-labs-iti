const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ],
    lastMessage: {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date,
    },
  },
  { timestamps: true }
);

chatSchema.index({ participants: 1 });

module.exports = mongoose.model('Chat', chatSchema);
