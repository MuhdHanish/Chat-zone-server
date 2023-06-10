const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatModel = Schema(
 {
  chatName: { type: String, trim: true },
  isGroupChat: { type: Boolean, default: false },
  users: [
   {
    type: Schema.Types.ObjectId,
    ref: 'User'
   }
  ],
  lastestMessage: {
   type: Schema.Types.ObjectId,
   ref: 'Message'
  },
  groupAdmin: {
   type: Schema.Types.ObjectId,
   ref : 'User'
  }
 },
 {
  timestamps: true
 }
);

const chatCollection = mongoose.model('Chat',chatModel);

module.exports = chatCollection;