var express = require('express');
// const user = require('../models/user');
var router = express.Router();
const raceCtrl = require('../controllers/races');

router.get('/new', isLoggedIn, raceCtrl.new);
router.post('/', isLoggedIn, raceCtrl.create);
router.get('/:id', isLoggedIn, raceCtrl.show);


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/auth/google');
    }
  }

module.exports = router;