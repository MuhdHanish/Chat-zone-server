const chatCollection = require("../model/chatModel");
const userCollection = require("../model/userModel");

module.exports = {
 fetchChats: async (req, res) => {
  try {
   const chats = datas;
   res.status(200).json({ message: 'Datas fetched successfully', chats: chats })
   return;
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 },
 accessChat: async (req, res) => {
  try {
   const { userId } = req.body;
   if (!userId) {
    res.status(400).json({ message: 'UserId param not provide in request' });
    return;
   }
   let isChat = await chatCollection.find({
    isGroupChat: false,
    $and: [
     { users: { $elemMatch: { $eq: req.user._id } } },
     { users: { $elemMatch: { $eq: userId } } }
    ]
   }).populate("users", "-password").populate("latestMessage");

   isChat = await userCollection.populate(isChat,{
    path:"latestMessage",
    select: "name email profile"
   })
   if(isChat.length>0){
    res.status(200).json({ message: 'Data accessed sucessfully', chat: isChat[0] })
    return;
   }else{
    const userData = {
     chatName: 'sender',
     isGroupChat: false,
     users : [req.user._id,userId]
    }
    return;
   }
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 },
}