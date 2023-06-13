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
 getUsers: async(req,res) =>{
  try{
   const keyWord = req.query.search ? {
    $or:  [
     { name: { $regex: req.query.search, $options: "i" } },
     { email: { $regex: req.query.search, $options: "i" } }
    ]
   } : {}
   const users = await userCollection.find(keyWord).find({_id: { $ne: req.user._id }})
   if(users){
    res.status(200).json({ message: 'Users fetched successfully', users: users })
   }
  }catch(err){
   res.status(500).json({ message: err.message });
   return;
  }
 },
 registerUser: async (req, res) => {
  try {
   const { name, email, password, image } = req.body;
   const userExist = await userCollection.findOne({ email: email })
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
       name: user.name,
       email:user.email,
       profile:user.profile,
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
       name: userExist.name,
       email: userExist.email,
       profile: userExist.profile,
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