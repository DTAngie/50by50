var express = require('express');
var router = express.Router();
const commentsCtrl = require('../controllers/comments');

router.post('/:id/comments', isLoggedIn, commentsCtrl.create);


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/auth/google');
    }
  }

module.exports = router;