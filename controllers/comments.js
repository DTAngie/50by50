const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
    create
}

function create(req, res) {
    console.log(req.params.id);
    Race.findById(req.params.id, function(err, race){
        if(err){
            // TODO deal with error
        }
        let newComment = {
            _id: mongoose.Types.ObjectId(),
            comment: req.body.comment,
        }
        User.findById(req.user._id, function(err, user){
            if(err){
                res.redirect('/races/new'); //TODO is this right path?
            }
            newComment.user = user._id;
            console.log('this is my race');
            console.log(race);
            race.comments.push(newComment);
            race.save();
            res.redirect(`/races/${race._id}`);
        });
    });
}