const User = require('../models/user');

module.exports = {
    show
}

function show(req, res) {
    console.log('made it her');
    User.findById(req.user.id, function(err, user){
      res.render('users/show', {title: 'My Profile', user});
    });
}