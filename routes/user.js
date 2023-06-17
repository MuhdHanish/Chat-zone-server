const express = require('express');
const router = express();
const userController = require('../controller/userController');
const chatContoller = require('../controller/chatController');
const messageController = require('../controller/messageController')
const protect = require('../middleware/authMiddleware');

// GET -> userController
router.get('/', userController.getHome);
router.get('/users', protect, userController.getUsers);

// POST -> userController
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// GET -> chatController
router.get('/chat', protect, chatContoller.fetchChats);

// POST -> chatContoller
router.post('/chat', protect, chatContoller.accessChat);
router.post('/group',protect,chatContoller.createGroupChat);

// PUT -> chatController
router.put('/rename',protect,chatContoller.renameGroup);
router.put('/addtogroup', protect, chatContoller.addToGroup);
router.put('/groupremove', protect, chatContoller.removeFromGroup);

// GET -> messageController
router.get('/message/:chatId',protect,messageController.allMessages)

// POST -> messageController 
router.post('/message',protect,messageController.sendMessage)

module.exports = router;