const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageModel  = Schema(
 {
  sender: { 
   type: Schema.Types.ObjectId ,
   ref: 'User'
  },
  content: { type: String ,trim: true },
  chat: {
   type: Schema.Types.ObjectId,
   ref: 'Chat'
  }
 },{
  timestamp: true
 }
);

const messageCollection = mongoose.model('Message', messageModel);

module.exports = messageCollection;