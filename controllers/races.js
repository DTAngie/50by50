const Race = require('../models/race');
const User = require('../models/user');
const Constants = require('../constants/index');
const mongoose = require('mongoose');

module.exports = {
    new: newRace,
    create,
    show
}

function newRace (req, res) {
    const states = Constants.states;
    res.render('races/new', {title: 'Add New Race', states});
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
    // Race.findById(req.params.id, function(err, race){

    //     res.render('races/show', {title: race.name, race});
    // })
    Race.findById(req.params.id)
    .then(race => { This needs to be fixed!!
        // let fastestRunner = race.runners.indexOf(id(race.fastest);
        race.populate({
            path: 'runners',
            match: {_id: race.fastest}
        }).exec(function(err, fastest){
            if(err) {
                // TODO Add error action
            }
            res.render('races/show', {title: race.name, race, fastest});
        })


        // fastestRunner.populate('runner').exec(function(err, fastest){
        //     if(err) {
        //         // TODO Add error action
        //     }
        //     res.render('races/show', {title: race.name, race, fastest});
        // });

        // race.fastest.populate('runners').exec(function(err, fastest){
        //     if(err){
        //     }
        //     res.render('races/show', {title: race.name, race, fastest});
        // }) //then what?
        // const fastest = {
        //    runner: race.runners.id(race.fastest),
        // }
    
        // race.runners.findById(race.fastest, function(err, fastest){
        //     console.log(fastest);
        //     if(err) {
        //         // TODO Add error action
        //     }
        // });
    });
}