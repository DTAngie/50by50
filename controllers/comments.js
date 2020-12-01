const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');
const { replaceOne } = require('../models/user');

module.exports = {
    create,
    delete: deleteComment
}

function create(req, res) {
    Race.findById(req.params.id, function(err, race){
        if(err){
            // TODO deal with error
            res.locals.err = "Error";
            res.redirect(`/races/${race._id}`);
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

function deleteComment (req, res) {
    Race.findById(req.params.id, function(err, race){
        const comment = race.comments.id(req.params.commentId).remove();
        race.save(function (err){
            if(err) {
                //do something
            }
            res.redirect(`/races/${race._id}`);
        })
    });
}