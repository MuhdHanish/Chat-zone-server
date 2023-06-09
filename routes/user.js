const express = require('express');
const router = express();

const chats = require('../data/data');

router.get('/',(req,res)=>{
 res.send('user get method...');
})

router.get('/api/chat',(req,res)=>{
 res.send(chats);
})

router.get('/api/chat/:id',(req,res)=>{
 const chat = chats.find(chat=>chat._id===req.params.id);
 res.send(chat);
})

module.exports = router;