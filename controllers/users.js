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
    let modified = [];
        
    //TODO test the following situations
    // 1. Race has only runner being deleted, no comments
    // 2. Race has other runners, with or without comments (deleted user is fastest runner)
    // 3. Race has other runners, (deleted user is not fastest runner)

        console.log('begin');

        Race.find({'comments.user': userId}, function(err, comments){
            comments.forEach(function(race){
                console.log('comment for each');
                console.log(race);
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
                    console.log('safe');
                }else {
                    console.log('deleted');
                    //TODO delete this after test
                }

            });
            console.log('end comment foreach');
        }).then(Race.find({'runners.runner': userId}, function(err, runners){
            runners.forEach(function(race){
                console.log('runner for each');
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
                    console.log('safe');
                }else {
                    console.log('deleted');
                     //TODO delete this after test
                }
            });
            console.log('end runner for each');
            
        })
        
        ).then(User.deleteOne({_id: userId}, function(err, user){
            if(err){
                //do something
            }
            console.log('redirect');
            res.redirect('/');
        }));
            
        //     () =>{
        //     modified.forEach(function(id){
        //         console.log('start saving');
        //         console.log(id);
        //         Race.find({_id: id}, function(err, race){
        //             if(err){
        //                 //do something
        //             }
        //             console.log('this is the race');
        //             console.log(race);
                    
        //             race.save();
        //         })
        //     });
        //     console.log('and done');
            
        // }).then(function(){
        //     console.log('redirect');
        //     res.redirect('/');

        // }

        


        function updateFaster(race){
            if (race.runners.length === 0) {
                console.log('no runners');
                //If the race has comments still, keep it but set the fastest runner to null
                race.fastest = null;
            } else if (!race.runners.id(race.fastest)) {
                console.log('shift it');
                //If there are other runners, find the next fastest runner
                let nextHigest = race.runners.sort(function(a, b){
                    return a.time - b.time;
                });
                race.fastest = nextHighest[0]._id;
            }
        }

        function needsDeletion(race){
            if(race.runners.length === 0 && race.comments.length === 0) {
                //If the race has no runners or comments, delete the race entirely
                console.log('nothing left');
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