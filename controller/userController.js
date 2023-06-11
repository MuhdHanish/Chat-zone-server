const datas = require('../data/data');
const bcrypt = require('bcryptjs')
const userCollection = require('../model/userModel');
const generateToken = require('../security/generateToken');

module.exports = {
 getHome: async (req, res) => {
  try {
   res.status(200).json({ message: 'Welcome to client side' })
   return;
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 },
 getChats: async (req, res) => {
  try {
   const chats = datas;
   res.status(200).json({ message: 'Datas fetched successfully', chats: chats })
   return;
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 },
 getChat: async (req, res) => {
  try {
   const chatId = req.params.id;
   const chat = datas.find(chat => chat._id === chatId);
   res.status(200).json({ message: 'Data fetched sucessfully', chat: chat })
   return;
  } catch (err) {
   res.status(500).json({ message: err.message });
  }
 },
 registerUser: async (req, res) => {
  try {
   const { name, email, password, image } = req.body;
   const userExist = await userCollection.findOne({ emai: email })
   if (userExist) {
    res.status(400).json({ message: 'Email is already registered' });
    return;
   } else {
    const hashPassword = await bcrypt.hash(password, 12)
    const user = await userCollection.create({
     name,
     email,
     password: hashPassword,
     image
    });
    if (user) {
     res.status(201).json({
      message: 'Registered successfully',
      user: {
       _id: user._id,
       token: generateToken(user._id)
      }
     });
     return;
    } else {
     res.status(400).json({ message: 'Failed to create user' });
     return;
    }
   }
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 },
 loginUser: async (req, res) => {
  try {
   const { email, password } = req.body;
   const userExist = await userCollection.findOne({ email: email });
   if (userExist) {
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (isMatch) {
     res.status(200).json({
      message: "Login successfully", user: {
       _id: userExist._id,
       token: generateToken(userExist._id)
      }
     })
     return;
    } else {
     res.status(400).json({ message: 'Invalid Password' })
     return;
    }
   } else {
    res.status(400).json({ message: 'Invalid Email' })
    return;
   }
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 }
}