const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const runnerSchema = new Schema({
    runner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    time: Number //this is the race in seconds
}, {
    timestamps: true
});

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
    runners: [runnerSchema],
    fastest: Number, //this will be the id for the runnerSchema
}, {
    timestamps: true
});

module.exports = mongoose.model('Race', raceSchema);