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

const  commentSchema = new Schema ({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
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
    fastest: String, //this will be the id for the runnerSchema
    comments: [commentSchema],
}, {
    timestamps: true
});

module.exports = mongoose.model('Race', raceSchema);



