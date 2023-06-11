const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userModel = Schema(
 {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  profile: { 
   type: String,
   default: 'https://static.vecteezy.com/system/resources/previews/013/042/571/original/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg' 
  }
 },
 {
  timestamps: true
 }
)

const userCollection = mongoose.model('User', userModel);

module.exports = userCollection;