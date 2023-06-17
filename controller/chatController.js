const chatCollection = require("../model/chatModel");
const userCollection = require("../model/userModel");

module.exports = {
 fetchChats: async (req, res) => {
  try {
   chatCollection.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
     results = await userCollection.populate(results, {
      path: "latestMessage.sender",
      select: "name email profile"
     });
     res.status(200).json({ message: 'Datas fetched successfully', chats: results })
    });
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

   isChat = await userCollection.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email profile"
   });
   if (isChat.length > 0) {
    res.status(200).json({ message: 'Data accessed sucessfully', chat: isChat[0] })
    return;
   } else {
    const chatData = {
     chatName: 'sender',
     isGroupChat: false,
     users: [req.user._id, userId]
    }
    try {
     const createdChat = await chatCollection.create(chatData);
     const fullChat = await chatCollection.findOne({ _id: createdChat._id }).populate("users", "-password");
     res.status(201).json({ message: 'FullChat accessed successfully', fullChat: fullChat });
     return;
    } catch (err) {
     res.status(400).json({ message: err.message })
    }
   }
  } catch (err) {
   res.status(500).json({ message: err.message });
   return;
  }
 },
 createGroupChat: async (req, res) => {
  try {
   if (!req.body.users || !req.body.name) {
    res.status(400).json({ message: 'Please fill the feilds' });
    return;
   }
   const users = JSON.parse(req.body.users);
   if (users.length < 2) {
   return res.status(400).json({ message: "More than 2 users are requried" })
   }
   users.push(req.user);
   const groupChat = await chatCollection.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user
   });
   const fullGroupChat = await chatCollection.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
   res.status(201).json({ message: "Group chat created successfully", fullGroupChat: fullGroupChat });
   return
  } catch (err) {
   res.status(500).json({ message: err.message })
  }
 },
 renameGroup: async (req, res) => {
  try {
   const { chatId, chatName } = req.body;
   const updatedChat = await chatCollection.findByIdAndUpdate(
    chatId,
    {
     chatName: chatName
    },
    {
     new: true
    }
   ).populate("users", "-password")
    .populate("groupAdmin", "-password");

   if (!updatedChat) {
    res.status(400).json({ message: "Chat not found" });
    return
   } else {
    res.status(201).json({ message: "Renamed sucessfully", updatedChat: updatedChat })
    return;
   }
  } catch (err) {
   res.status(500).json({ message: err.message })
   return
  }
 },
 addToGroup: async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await chatCollection.findByIdAndUpdate(
   chatId,
   {
    $push: { users: userId }
   }, {
   new: true
  }
  ).populate("users", "-password")
   .populate("groupAdmin", "-password");

  if (!added) {
   res.status(400).json({ message: "Chat not found" });
   return;
  } else {
   res.status(201).json({ message: "Added to group successfully", added: added })
   return;
  }
 },
 removeFromGroup: async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await chatCollection.findByIdAndUpdate(
   chatId,
   {
    $pull: { users: userId }
   }, {
   new: true
  }
  ).populate("users", "-password")
   .populate("groupAdmin", "-password");

  if (!removed) {
   res.status(400).json({ message: "Chat not found" });
   return;
  } else {
   res.status(201).json({ message: "Removed from group successfully", removed: removed })
   return;
  }
 }
}