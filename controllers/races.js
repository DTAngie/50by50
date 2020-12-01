const Race = require('../models/race');
const User = require('../models/user');
const Constants = require('../constants/index');
const dateFormat = require('dateformat');
const mongoose = require('mongoose');

module.exports = {
    index,
    new: newRace,
    create,
    show
}

function index(req, res) {
    Race.find({}).sort({name: 'ascending'}).exec(function(err, races){
        if(err){
            res.redirect('/');
        } else {
            res.render('races/index', {title: 'All Races', races, dateFormat});
        }
    })
}

function newRace (req, res) {
    const states = Constants.states;
    Race.find({}).sort({name: 'descending'}).exec(function(err, races){
        if(err){
            res.redirect('/');
        }
        res.render('races/new', {
            title: 'Add New Race',
            states,
            races, 
            errors: req.flash('errors'),
        });
    });
}

function create(req, res) {
    let userID = req.user._id;
    let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);

    Race.create(req.body, function(err, race){
        if(err){
            let errorsArray = [];
            for(e in err.errors){
                errorsArray.push(e.charAt(0).toUpperCase() + e.slice(1)
                + " is " + err.errors[e].kind
                );
            }
            req.flash('errors', errorsArray);
            res.redirect('/races/new');
        } else {
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
                req.flash('current-race', race._id);
                req.flash('message', "New Race added");
                res.redirect(`/users/profile/${userID}`); 
            });
        }
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


function show(req, res) {
    let message = req.flash('message');
    let errMessage = req.flash('errors');
    Race.findById(req.params.id)
    .populate({path: 'comments.user', select: 'name displayName'})
    .populate({path: 'runners.runner', select: 'name displayName'}).exec(function(err, race){
        if(race.fastest){
            const fastestTime = race.runners.id(race.fastest);
            User.findById(fastestTime.runner, "name displayName", function(err, runner) {
                const fastest = {
                    name: (runner.displayName) ? runner.displayName : runner.name,
                    time: fastestTime.time,
                }
                res.render('races/show', {
                    title: race.name,
                    race,
                    fastest,
                    runners: race.runners.length > 0 ? race.runners : null,
                    comments: race.comments.length > 0 ? race.comments : null,
                    dateFormat,
                    message: message.length > 0 ? message : "",
                    errors: errMessage.length > 0 ? errMessage : "",
                });        
            })
        } else {
            res.render('races/show', {
                title: race.name,
                race,
                fastest: null,
                runners: race.runners.length > 0 ? race.runners : null,
                comments: race.comments.length > 0 ? race.comments : null,
                dateFormat,
                message: message.length > 0 ? message : "",
                errors: errMessage.length > 0 ? errMessage : "",
            });
        }
    });
}