const Race = require('../models/race');

module.exports = {
    new: newRace
}

function newRace (req, res) {
    res.render('races/new', {title: 'Add New Race'});
}