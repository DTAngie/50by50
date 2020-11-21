const Race = require('../models/race');
const Constants = require('../constants/index');

module.exports = {
    new: newRace
}

function newRace (req, res) {
    const states = Constants.states;
    res.render('races/new', {title: 'Add New Race', states});
}