const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    city: String,
    state: String,
    date: {
        type: Date,
        required: true,
    },
    fastest: Number, //this will be the id for the usertime
}, {
    timestamps: true
});

module.exports = mongoose.model('Race', raceSchema);