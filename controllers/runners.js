const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
    create
}
//TODO test this out!!
function create(req, res) {
    Race.findById(req.params.id, function(err, race){
        if(err){
            // TODO deal with error
        }
        let person = {
            _id: mongoose.Types.ObjectId(),
            time: time,
        }
        User.findById(req.user._id, function(err, user){
            if(err){
                res.redirect('/races/new'); //TODO is this right path?
            }
            person.runner = user._id;
            race.runners.push(person);
            race.save();
            res.redirect(`/users/profile/${user._id}`); //TODO make this redirect to wherever makes sense!
        });
    });
}
