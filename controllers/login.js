const express = require('express');
const router = express.Router();



// ==============
// ROUTES
// ==============

router.get('/', (req, res) => {

  res.render('login.ejs')

 
});


module.exports = router;
