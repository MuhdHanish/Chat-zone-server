const chatCollection = require("../model/chatModel");
const messageCollection = require("../model/messageModel");
const userCollection = require("../model/userModel");

module.exports = {
 allMessages: async (req, res) => {
  try {
   const messages = await messageCollection.find({ chat: req.params.chatId })
    .populate("sender", "name email profile")
    .populate("chat");
    res.status(200).json({message:"Messages fetched successfully",fetchedMessages:messages})
  } catch (err) {
    res.status(400).json({message:err.message})
  }
 },
 sendMessage: async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
   return res.status(400).json({message:"Invalid data passed"})
  }
  const newMessage = {
   sender: req.user._id,
   content: content,
   chat: chatId
  };
  try {
   let message = await messageCollection.create(newMessage);
   message = await message.populate("sender", "name profile");
   message = await message.populate("chat");
   message = await userCollection.populate(message, {
    path: "chat.users",
    select: "name email profile"
   });
   await chatCollection.findByIdAndUpdate(req.body.chatId, {
    latestMessage: message
   });
   return res.status(201).json({ message: "Message sented successfully", sentedMessage: message });
  } catch (err) {
   return res.status(400).json({ message: err.message });
  }
 }
}