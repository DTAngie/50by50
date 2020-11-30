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
    User.findById(userID)
    .then(user => {
        Race.find({'runners.runner': userID}, function(err, races){
        let currentRace;
        if(req.query.currentRace) {
            Race.findOne({_id: req.query.currentRace, 'runners.runner': userID }, function(err, race){
                if(err){
                    // TODO do something
                }
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
            });
        }
        })
       
    }); 
}
//TODO use the existing location form to change display name, use current value to populate form
function update(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            //do something
        }
        user.displayName = req.body.displayName;
        user.city = req.body.city;
        user.state = req.body.state;
        user.save();
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
                //do something
            }
            res.redirect('/');
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
                race.deleteOne(function(err){
                    if(err){
                        // do something
                    }
                });
                return true;
            } else {
                return false;
            }
        }
      
   






    // deleteUser();
    // async function deleteUser(){
    //     await Race.find({'comments.user': userId}).exec( function(err, comments){
    //         // TODO for each comment, loop through them and delete them/
    //         comments.forEach(function(race){
    //             console.log(race);
    //             race.comments.forEach(function(c){
    //                 if(c.user.toString() === userId.toString()){
    //                     // c.remove();
    //                     if(modified.indexOf(race._id.toString()) === -1){
    //                         modified.push(race._id.toString());
    //                     }
    //                 }
    //             });
    //             console.log(race);
    //         });
    //     });

    //     await Race.find({'runners.runner': userId}, function(err, runners){
    //         runners.forEach(function(race){
    //             race.runners.forEach(function(r){
    //                 if(r.runner.toString() === userId.toString()){
    //                     r.remove();
    //                 }
    //             });
    //             if(race.runners.length === 0 && race.comments.length === 0) {
    //                 //If the race has no runners or comments, delete the race entirely
    //                 race.deleteOne(function(err){
    //                     if(err){
    //                         // do something
    //                     }
    //                 });
    //             } else if (race.runners.length === 0) {
    //                 //If the race has comments still, keep it but set the fastest runner to null
    //                 if(modified.indexOf(race._id.toString()) === -1){
    //                     modified.push(race._id.toString());
    //                 }
    //                 race.fastest = null;
    //             } else if (!race.runners.id(race.fastest)) {
    //                 //If there are other runners, find the next fastest runner
    //                 if(modified.indexOf(race._id.toString()) === -1){
    //                     modified.push(race._id.toString());
    //                 }
    //                 let nextHigest = race.runners.sort(function(a, b){
    //                     return a.time - b.time;
    //                 });
    //                 race.fastest = nextHighest[0]._id;
    //             }

    //         });
    //     });
        
    //     await User.deleteOne({_id: userId}, function(err){
    //         if(err){
    //             //do something
    //         }
    //         modified.forEach(function(id){
    //             Race.findById(id, function(err, race){
    //                 console.log('this is the race');
    //                 console.log(race);
    //                 if(err){
    //                     //do something
    //                 }
    //                 race.save();
    //             })
    //         });
    //         res.redirect('/');
    //     });

    // }
}