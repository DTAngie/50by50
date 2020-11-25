const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
    create
}
//TODO test this out!!
function create(req, res) {
    let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);
    Race.findById(req.body.id, function(err, race){
        const fastestTime = race.runners.id(race.fastest);
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
            if(fastestTime.time > time) {
                race.fastest = person._id
            }
            race.save();
            
            res.redirect(`/users/profile/${user._id}`);
        });
    });
    function formatTime(hr, min, sec) {
        if(!hr && !min && !sec){
            return null;
        }
        let time = 0;
        if(hr){
            time += (parseInt(hr)*3600);
        }
        if(min){
            time += (parseInt(min)*60);
        }
        if(sec){
            time += (parseInt(sec));
        }
        return time;
    }
}
