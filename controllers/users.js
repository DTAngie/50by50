const User = require('../models/user');
const Race = require('../models/race');
const dateFormat = require('dateformat');
const user = require('../models/user');

module.exports = {
    show
}

function show(req, res) {
    const userID = (!req.params.id) ? req.user._id : req.params.id;
    const isOwner = (req.user._id === userID) ? true : false;
    User.findById(userID)
    .then(user => {
        Race.find({'runners.runner': userID}, function(err, races){
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
            isOwner,
        });
        })
       
    }); 
}