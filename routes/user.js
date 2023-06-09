const express = require('express');
const router = express();

router.get('/',(req,res)=>{
 res.send('user get method...');
})

module.exports = router