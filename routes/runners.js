var express = require('express');
var router = express.Router();
const runnersCtrl = require('../controllers/runners');

router.post('/runners', isLoggedIn, runnersCtrl.create);
router.put('/:id/runners/:runnerId', isLoggedIn, runnersCtrl.update);
router.delete('/:id/runners/:runnerId', isLoggedIn, runnersCtrl.delete);


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/auth/google');
    }
  }

module.exports = router;