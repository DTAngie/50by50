const User = require('../models/user');
const Race = require('../models/race');
const dateFormat = require('dateformat');
const Constants = require('../constants/index');

module.exports = {
    show,
    update
}

function show(req, res) {
    const states = Constants.states;
    const userID = (!req.params.id) ? req.user._id : req.params.id;
    const isOwner = (req.user._id.toString() === userID.toString()) ? true : false;
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
            states
        });
        })
       
    }); 
}

function update(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            //do something
        }
        if(req.user._id !== req.params.id){
            //TODO catch error
            //test this to make sure it works
            //if so, use this for every edit and add
        }
        user.city = req.body.city ? req.body.city : user.city;
        user.state = req.body.state ? req.body.state : user.state;
        user.save();
        res.redirect(`/users/profile/${user._id}`);
    })
}