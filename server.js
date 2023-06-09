const express = require('express');
const app = express();

require('dotenv').config()

const logger = require('morgan');
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

const cors = require('cors');
app.use(cors({
 origin: process.env.CORS_ORIGIN_URL,
 methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

const userRouter = require('./routes/user')
app.use('/',userRouter)

const PORT = process.env.PORT 
app.listen(PORT,()=>console.log(`Server started on port ${PORT}...`))