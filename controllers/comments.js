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
            req.flash('errors', "Something went wrong. Please try again");
            res.redirect(`/races/${race._id}`);
        }
        let newComment = {
            _id: mongoose.Types.ObjectId(),
            comment: req.body.comment,
        }
        User.findById(req.user._id, function(err, user){
            newComment.user = user._id;
            race.comments.push(newComment);
            race.save();
            req.flash('message', "Comment posted.");
            res.redirect(`/races/${race._id}`);
        });
    });
}

function deleteComment (req, res) {
    Race.findById(req.params.id, function(err, race){
        const comment = race.comments.id(req.params.commentId).remove();
        race.save(function (err){
            req.flash('message', "Comment deleted.");
            res.redirect(`/races/${race._id}`);
        })
    });
}