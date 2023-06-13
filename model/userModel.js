const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userModel = Schema(
 {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  profile: { 
   type: String,
   default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' 
  }
 },
 {
  timestamps: true
 }
)

const userCollection = mongoose.model('User', userModel);

module.exports = userCollection;