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
app.listen(PORT,()=>console.log(`Server started on port ${PORT}...`.green.underline))