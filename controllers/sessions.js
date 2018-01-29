const express = require('express');
const router = express.Router();

// ==============
// MIDDLEWARE
// ==============

router.use(express.urlencoded({ extended: false}));
router.use(express.json());
router.use(express.static('public'));


// ==============
// ROUTES
// ==============

router.get('/', (req, res) => {

  res.send(req.session.user);

 
});

router.post('/', (req, res) => {
  req.session.user = req.body;
  req.session.save()
});

router.delete('/', (req, res) => {
  req.session.user = null;
  req.session.save()
});


module.exports = router;
