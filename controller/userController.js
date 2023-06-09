const datas = require('../data/data');

module.exports = {
 getHome : async (req,res) =>{
  try{
   res.status(200).json({message:'Welcome to client side'})
  }catch(err){
   res.status(500).json({ message: err.message });
  }
 },
 getChats : async(req,res) =>{
  try{
   const chats = datas;
   res.status(200).json({message:'Datas fetched successfully',chats:chats})
  }catch(err){
   res.status(500).json({ message: err.message });
  }
 },
 getChat : async(req,res) =>{
  try{
   const chatId = req.params.id;
   const chat = datas.find(chat => chat._id === chatId);
   res.status(200).json({message:'Data fetched sucessfully',chat:chat})
  }catch(err){
   res.status(500).json({ message: err.message });
  }
 }
}