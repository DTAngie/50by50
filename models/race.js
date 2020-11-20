const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raceSchema = new Schema({

}, {
    timestamps: true
});

module.exports = mongoose.model('Race', raceSchema);