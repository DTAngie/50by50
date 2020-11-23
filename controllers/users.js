const User = require('../models/user');
const Race = require('../models/race');
const dateFormat = require('dateformat');

module.exports = {
    show
}

function show(req, res) {
    User.findById(req.user._id )
    .then(user => {
        Race.find({'runners.runner': user._id}, function(err, races){
        let currentRace;
        if(req.query.currentRace) {
            currentRace = races[req.query.currentRace];
            console.log(currentRace);
            currentRace.time = new Date(currentRace.runners[0].time * 1000).toISOString().substr(11,8);
        }
        res.render('users/show', {
            title: "My Profile",
            user,
            races,
            dateFormat,
            currentRace: currentRace,
        });
        })
       
    }); 
}