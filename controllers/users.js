const User = require('../models/user');
const Race = require('../models/race');
const dateFormat = require('dateformat');
const Constants = require('../constants/index');

module.exports = {
    show,
    update,
    delete: deleteUser,
}

function show(req, res) {
    const states = Constants.states;
    //userID refers to the owner of the profile, not the user logged in
    const userID = (!req.params.id) ? req.user._id : req.params.id; 
    const isOwner = (req.user._id.toString() === userID.toString()) ? true : false;
    User.findById(userID)
    .then(user => {
        Race.find({'runners.runner': userID}, function(err, races){
        let currentRace;
        if(req.query.currentRace) {
            // currentRace = races[req.query.currentRace];
            console.log(req.query.currentRace);

            Race.findOne({_id: req.query.currentRace, 'runners.runner': userID }, function(err, race){
                if(err){
                    console.log('error here');
                    console.log(err);
                }
                console.log(race);
                currentRace = race;
                let racer = race.runners.filter(function(r){
                    console.log('inside filter');
                    console.log(r.runner);
                    console.log(userID);
                    return r.runner.toString() === userID.toString();
                });
                console.log(racer[0].time);
                console.log(currentRace);
                currentRace.time = new Date(racer[0].time * 1000).toISOString().substr(11,8);
                currentRace.runnerId = racer[0]._id;
                
                res.render('users/show', {
                    title: "Profile",
                    user,
                    races,
                    dateFormat,
                    currentRace: currentRace,
                    isOwner,
                    states
                });
            });
            



            
        } else {

            res.render('users/show', {
                title: "Profile",
                user,
                races,
                dateFormat,
                currentRace: currentRace,
                isOwner,
                states
            });
        }
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

function deleteUser(req, res) {
    const userId = req.user._id;
    User.findById(userId, function(err, user){
        //find comments
        Race.find({'comments.user': userId}, function(err, comments){
            // TODO for each comment, loop through them and delete them/
            
            console.log("these are the comments");
            console.log(comments);
        });

        //find runners

        //delete user
    });
}