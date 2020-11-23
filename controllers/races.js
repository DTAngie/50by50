const Race = require('../models/race');
const User = require('../models/user');
const Constants = require('../constants/index');

module.exports = {
    new: newRace,
    create
}

function newRace (req, res) {
    const states = Constants.states;
    res.render('races/new', {title: 'Add New Race', states});
}

function create(req, res) {
    let userID = req.user._id;
    let time = formatTime(req.body.hours, req.body.minutes, req.body.seconds);
    let person = {
        time: time,
    }

    Race.create(req.body, function(err, race){
        if(err){
            res.redirect('/races/new');
        }
        updateFastestTime(time, race);
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

    function updateFastestTime(time, race){
        if (time < race.fastest){
            race.fastest = time;
            race.save()
        }
    }
}