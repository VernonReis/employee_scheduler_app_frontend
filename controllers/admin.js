const express = require('express');
const router = express.Router();



// ==============
// ROUTES
// ==============

router.get('/', (req, res) => {

  res.render('admin.ejs')

 
});


module.exports = router;
