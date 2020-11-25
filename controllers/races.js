const Race = require('../models/race');
const User = require('../models/user');
const Constants = require('../constants/index');
const mongoose = require('mongoose');

module.exports = {
    index,
    new: newRace,
    create,
    show
}

function index(req, res) {
    Race.find({}).sort({name: 'descending'}).exec(function(err, races){
        if(err){
            //TODO do something
        }
        res.render('races/index', {title: 'All Races', races});
    })
}

function newRace (req, res) {
    const states = Constants.states;
    Race.find({}).sort({name: 'descending'}).exec(function(err, races){
        if(err){
            //do something
        }
        res.render('races/new', {title: 'Add New Race', states, races});
    });
}

function create(req, res) {
    let userID = req.user._id;
    let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);

    Race.create(req.body, function(err, race){
        if(err){
            res.redirect('/races/new');
        }
        let person = {
            _id: mongoose.Types.ObjectId(),
            time: time,
        }
        if(time) {
            race.fastest = person._id;
        }
        User.findById(userID, function(err, user){
            if(err){
                res.redirect('/races/new');
            }
            person.runner = user._id;
            race.runners.push(person);
            race.save();
            res.redirect(`/users/profile/${userID}`); 
        });
    })

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
//TODO this should go in a different function after the race has already been created
// function updateFastestTime(time, race){
//     if (time < race.fastest){
//         race.fastest = time;
//         race.save()
//     }
// }

function show(req, res) {
    Race.findById(req.params.id, function(err, race){
        const fastestTime = race.runners.id(race.fastest);
        User.findById(fastestTime.runner, "name", function(err, runner){
            if(err){
                //TODO add error action
            }
            const fastest = {
                name: (runner.displayName) ? runner.displayName : runner.name,
                time: new Date(fastestTime.time * 1000).toISOString().substr(11,8) 
                //TODO do this date formatting in the view
            }
            Race.find({_id: req.params.id}).populate('runners.runner', 'name').exec(function(err, people){
                // console.log(people[0].runners[0].runner.name);
                // console.log(people);
                Race.find({_id: req.params.id}).populate('comments.user', 'name').exec(function(err, comments){
                    res.render('races/show', {
                        title: race.name,
                        race,
                        fastest,
                        runners: people[0].runners,
                        comments: comments.length > 0 ? comments[0].comments : null,
                    });

                });
            });
        });
    })
}