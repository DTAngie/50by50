const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');
const user = require('../models/user');

module.exports = {
    create,
    update,
    delete: deleteRunner,
}

function create(req, res) {
    let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);
    Race.find({_id: req.body.id, 'runners.runner': req.user._id}, function(err, races){
        if(races.length > 0) {
            req.flash('errors', "Looks like you have already run this race. You can update your time from your profile page.");
            res.redirect('/races/new');
        } else {
            Race.findById(req.body.id, function(err, race){
                const fastestTime = (race.fastest) ? race.runners.id(race.fastest) : null ;
                if(err){
                   req.flash('errors', "Could not find that race, please try again.");
                   res.redirect('/races/new');
                } else {
                    let person = {
                        _id: mongoose.Types.ObjectId(),
                        time: time,
                    }
                    User.findById(req.user._id, function(err, user){
                        if(err){
                            res.redirect('/races/new');
                        }
                        person.runner = user._id;
                        race.runners.push(person);
                        if(fastestTime) {
                            if(fastestTime.time > time) {
                                race.fastest = person._id
                            }
                        } else {
                            race.fastest = person._id
                        }
                        race.save();
                        req.flash('message', "New Race added");
                        res.redirect(`/users/profile/${user._id}`);
                    });
                }
            });
        }
    });
}

function update(req, res) {
    Race.findById(req.params.id, function(err, race){
        if(err){
            req.flash('errors', "Could not find that race, please try again.");
            res.redirect(`/users/profile/${req.user._id}`);
        } else {
            const runner = race.runners.id(req.params.runnerId);
            const raceFastest = race.fastest ? race.fastest : "null";
            const fastestTime = (race.fastest) ? race.runners.id(race.fastest).time : null ;
            let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);
            runner.time = time;
            if(raceFastest.toString() !== runner._id.toString() ){
                //If user was not fastest user and now is after edit
                if(runner.time < fastestTime || fastestTime === null){
                    race.fastest = runner._id;
                }
            } else {
                //If user was the fastest user and now is not after edit
                if(runner.time > fastestTime || runner.time == null){
                    let nextHighest = race.runners.sort(function(a, b){
                        return a.time - b.time;
                    });
                    if(nextHighest[0].time !== null && nextHighest[0].time !== 0){
                        race.fastest = nextHighest[0]._id;
                    } else {
                        race.fastest = null;
                    }
                }
            }
            race.save();
            req.flash('message', "Chip time updated");
            res.redirect(`/users/profile/${req.user._id}?currentRace=${req.params.id}`);
        }
    });
}

function deleteRunner(req, res) {
    Race.findById(req.params.id, function(err, race){
        if(err) {
        }
        const runnerId = req.params.runnerId;
        const runner = race.runners.id(runnerId);
        runner.remove();
        if(race.runners.length === 0){
            race.fastest = null;
        } else if (race.fastest.toString() === runnerId.toString()) {
            let nextHighest = race.runners.sort(function(a, b){
                return a.time - b.time;
            });
            race.fastest = nextHighest[0]._id;
        }
        race.save();
        //If there are no subdocs in the Race, delete it
        if(race.runners.length === 0 && race.comments.length === 0) {
            race.deleteOne();
        }  
        req.flash('message', "Race deleted");
        res.redirect(`/users/profile/${req.user._id}`);            
    })

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