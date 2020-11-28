var express = require('express');
var router = express.Router();
const commentsCtrl = require('../controllers/comments');

router.post('/:id/comments', isLoggedIn, commentsCtrl.create);
router.delete('/:id/comments/:commentId', isLoggedIn, commentsCtrl.delete);


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/auth/google');
    }
  }

module.exports = router;