const Race = require('../models/race');
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

    Race.create(req.body, function(err, race){
        if(err){
            res.redirect('/races/new');
        }
        res.redirect(`/users/profile/${res.locals.user._id}`); 
    })
}