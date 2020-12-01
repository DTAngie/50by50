const User = require('../models/user');
const Race = require('../models/race');
const dateFormat = require('dateformat');
const Constants = require('../constants/index');
const comments = require('./comments');
const runners = require('./runners');

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
    const mapKey = process.env.GOOGLE_API_KEY;
    let message = req.flash('message');
    let errMessage = req.flash('errors');
    let currentRaceId = req.flash('current-race');
    if(currentRaceId){
        currentRaceId = req.query.currentRace;
    }
    User.findById(userID)
    .then(user => {
        Race.find({'runners.runner': userID}, function(err, races){
        let currentRace;
        if(currentRaceId) {
            Race.findOne({_id: currentRaceId, 'runners.runner': userID }, function(err, race){
                currentRace = race;
                let racer = race.runners.filter(function(r){
                    return r.runner.toString() === userID.toString();
                });
                currentRace.time = new Date(racer[0].time * 1000).toISOString().substr(11,8);
                currentRace.runnerId = racer[0]._id;

                const mapLocation = currentRace.city.replace("/\s/g", "+") + "," + currentRace.state;
                
                res.render('users/show', {
                    title: "Profile",
                    races,
                    dateFormat,
                    currentRace: currentRace,
                    isOwner,
                    states,
                    mapKey,
                    mapLocation,
                    message: message.length > 0 ? message : "",
                    errors: errMessage.length > 0 ? errMessage : "",

                });
            });            
        } else {
            res.render('users/show', {
                title: "Profile",
                races,
                dateFormat,
                currentRace: currentRace,
                isOwner,
                states,
                message: message.length > 0 ? message : "",
                errors: errMessage.length > 0 ? errMessage : "",
            });
        }
        })
    }); 
}

function update(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            req.flash('errors', "Something went wrong. Please try again");
            res.redirect(`/users/profile/${user._id}`);
        }
        user.displayName = req.body.displayName;
        user.city = req.body.city;
        user.state = req.body.state;
        user.save(function(err){
            if(err){
                req.flash('errors', "Something went wrong. Please try again");
                res.redirect(`/users/profile/${user._id}`);
            }
        });
        req.flash('message', "Profile updated.");
        res.redirect(`/users/profile/${user._id}`);
    })
}

function deleteUser(req, res) {
    const userId = req.user._id;
    let modified = [];

    Race.find({'comments.user': userId}, function(err, comments){
        comments.forEach(function(race){
            race.comments.forEach(function(c){
                if(c.user.toString() === userId.toString()){
                    c.remove();
                    if(modified.indexOf(race._id.toString()) === -1){
                        modified.push(race._id.toString());
                    }
                }
            });
            if(!needsDeletion(race)){
                race.save();
            }
        });
    }).then(Race.find({'runners.runner': userId}, function(err, runners){
        runners.forEach(function(race){
            race.runners.forEach(function(r){
                if(r.runner.toString() === userId.toString()){
                    r.remove();
                    if(modified.indexOf(race._id.toString()) === -1){
                        modified.push(race._id.toString());
                    }
                }
            });
            if(!needsDeletion(race)){
                updateFaster(race);
                race.save();
            }
        });            
    })
    ).then(User.deleteOne({_id: userId}, function(err, user){
        if(err){
            if(err){
                req.flash('errors', "Something went wrong. Please try again");
                res.redirect(`/users/profile/${user._id}`);
            }
        } else {
            req.flash('message', "Account Deletion Successful");
            res.redirect('/');
        }
    }));        


    function updateFaster(race){
        if (race.runners.length === 0) {
            //If the race has comments still, keep it but set the fastest runner to null
            race.fastest = null;
        } else if (!race.runners.id(race.fastest)) {
            //If there are other runners, find the next fastest runner
            let nextHighest = race.runners.sort(function(a, b){
                return a.time - b.time;
            });
            race.fastest = nextHighest[0]._id;
        }
    }

    function needsDeletion(race){
        if(race.runners.length === 0 && race.comments.length === 0) {
            //If the race has no runners or comments, delete the race entirely
            race.deleteOne();
            return true;
        } else {
            return false;
        }
    }
}