const express = require('express');
const router = express();
const userController = require('../controller/userController');

// GET 
router.get('/',userController.getHome);
router.get('/api/chat',userController.getChats);
router.get('/api/chat/:id',userController.getChat);


// POST
router.post('/register',userController.registerUser);
router.post('/login',userController.loginUser);

module.exports = router;