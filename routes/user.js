const express = require('express');
const router = express();
const userController = require('../controller/userController');

// GET 
router.get('/',userController.getHome)
router.get('/api/chats',userController.getChats)
router.get('/api/chat/:id',userController.getChat)

module.exports = router;