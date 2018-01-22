const express = require('express');
const router = express.Router();



// ==============
// ROUTES
// ==============

router.get('/', (req, res) => {

  res.render('employee.ejs')

 
});


module.exports = router;
