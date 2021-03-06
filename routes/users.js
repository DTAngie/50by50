var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/users');

router.get('/profile', isLoggedIn, userCtrl.show);
router.get('/profile/:id', isLoggedIn, userCtrl.show);
router.put('/profile/:id', isLoggedIn, userCtrl.update);
router.delete('/', isLoggedIn, userCtrl.delete);

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
      return next()
  } else {
      res.redirect('/auth/google');
  }
}

module.exports = router;
