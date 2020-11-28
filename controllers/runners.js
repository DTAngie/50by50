const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
    create,
    update,
    delete: deleteRunner,
}
//TODO test this out!! Is this even being used?
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
}

function update(req, res) {
    Race.findById(req.params.id, function(err, race){
        if(err){
            //do something
        }
        const runner = race.runners.id(req.params.runnerId);
        let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);
        runner.time = time;
        race.save();
        res.redirect(`/users/profile/${req.user._id}?currentRace=${req.params.id}`);
    });
}

function deleteRunner(req, res) {
    //first delete the runner
    //then, if there are no runners left, delete the race
}

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