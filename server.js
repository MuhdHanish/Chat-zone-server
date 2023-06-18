const express = require('express');
const connect = require('./config/connection');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const colors = require('colors');

const app = express();
require('dotenv').config();
connect();

const logger = require('morgan');
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const cors = require('cors');
app.use(cors({
 origin: process.env.CORS_ORIGIN_URL,
 methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const userRouter = require('./routes/user');
app.use('/',userRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT 
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}...`.green.underline))
const io = require('socket.io')(server, {
 pingTimeout: 60000,
 cors: {
  origin: process.env.CORS_ORIGIN_URL
 }
})
io.on("connection", (socket) => {
 console.log(`connected to socket.io`);
 socket.on("setup", (userData) => {
  socket.join(userData?._id);
  socket.emit("connected");
 })
 socket.on("join chat", (room) => {
  socket.join(room);
  console.log(`User joined room: ${room}`)
 })
 socket.on("typing", (room) => socket.in(room).emit("typing"));
 socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
 socket.on("new message", (newMessageRecieved) => {
  let chat = newMessageRecieved?.chat;
  if (!chat?.users) return console.log(`chat. user not defined`);
  chat?.users.forEach((user) => {
   if (user?._id === newMessageRecieved?.sender?._id) return;
   socket.in(user?._id).emit("message recieved",newMessageRecieved)
  })
 })
});