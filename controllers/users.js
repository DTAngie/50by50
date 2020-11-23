const User = require('../models/user');
const Race = require('../models/race');

module.exports = {
    show
}

function show(req, res) {
    // User.findById(req.user.id, function(err, user){
    //   res.render('users/show', {title: 'My Profile', user});
    // });
    User.findById(req.user._id )
    .then(user => {
        Race.find({'runners.runner': user._id}, function(err, races){
        res.render('users/show', {title: "My Profile",  user, races});
        })
       
    });
    
}