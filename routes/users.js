var express = require('express');
// const user = require('../models/user');
var router = express.Router();
const userCtrl = require('../controllers/users');

router.get('/profile', isLoggedIn, userCtrl.show);
router.get('/profile/:id', isLoggedIn, userCtrl.show);

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next()
  } else {
      res.redirect('/auth/google');
  }
}

module.exports = router;
