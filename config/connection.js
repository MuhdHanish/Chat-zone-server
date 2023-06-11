const mongoose = require('mongoose');
const connect = async() =>{
 try{
  const connection = await mongoose.connect(process.env.MONGO_URI,{
   useNewUrlParser: true,
   useUnifiedTopology: true,
  });
  console.log(`Database connected: ${connection.connection.host}`.yellow.underline);
 }catch(err){
  console.log(`Error: ${err.message}`.red.underline);
  process.exit();
 }
}

module.exports = connect;