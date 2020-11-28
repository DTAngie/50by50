const Race = require('../models/race');
const User = require('../models/user');
const mongoose = require('mongoose');

module.exports = {
    create,
    update,
    delete: deleteRunner,
}

function create(req, res) {
    let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);
    Race.findById(req.body.id, function(err, race){
        console.log('create new runner');
        console.log(race.fastest);
        const fastestTime = (race.fastest) ? race.runners.id(race.fastest) : null ;
        console.log(fastestTime);
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
            if(fastestTime) {
                if(fastestTime.time > time) {
                    race.fastest = person._id
                }
            } else {
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
        race.save(function(err){
            if(err){
                //do something
            }
            res.redirect(`/users/profile/${req.user._id}?currentRace=${req.params.id}`);
        });
    });
}
//TODO find all saves and make sure they have callback function like above

function deleteRunner(req, res) {
    //first delete the runner
    Race.findById(req.params.id, function(err, race){
        if(err) {
        }
        const runner = race.runners.id(req.params.runnerId);
        runner.remove();
        console.log(race);
        race.fastest = null;
        race.save(function(err){
            if(err){
                console.log('there was an error with saving');
                //do something
            }
            console.log(race);
            if(race.runners.length === 0 && race.comments.length === 0) {
                race.deleteOne(function(err){
                    if(err){
                        // do something
                    }
                    res.redirect(`/users/profile/${req.user._id}`);
                })
            } else {
                res.redirect(`/users/profile/${req.user._id}`)
            }
        });
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