var express = require('express');
var router = express.Router();
const passport = require('passport');

//Google OAuth Routes
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', function(req, res, next) {
  passport.authenticate('google', function(err, user) {
    if(err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/');
    }
    req.logIn(user, function(err){
      if(err) {
        return next(err);
      }
      return res.redirect(`/users/profile/${req.user._id}`);
    });
  }) (req, res, next);
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/', function(req, res, next) {
  const message = req.flash('message');
  const errors = req.flash('errors');
  res.render('index', {
    title: '50 by 50',
    message: message.length > 0 ? message : "",
    errors: errors.length > 0 ? errors : "",
 });
});

module.exports = router;
