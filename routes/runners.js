var express = require('express');
var router = express.Router();
const runnersCtrl = require('../controllers/runners');

router.post('/', isLoggedIn, runnersCtrl.create);


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/auth/google');
    }
  }

module.exports = router;